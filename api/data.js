import { neon } from '@neondatabase/serverless';

const NEON_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_kBrW6MZ4UtFX@ep-purple-butterfly-avk014lq-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(NEON_URL);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let action = req.query?.action;
  let payload = null;

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    action = body.action || action || 'fetchAll';
    payload = body.payload;
  } else {
    action = action || 'fetchAll';
  }

  try {
    if (action === 'fetchAll') {
      const [members, transactions, attendanceLogs, expenses, dailyVisitors] = await Promise.all([
        sql`SELECT id, name, phone, package_id AS "packageId", start_date AS "startDate", end_date AS "endDate", total_visits AS "totalVisits", history_count AS "historyCount", last_visit AS "lastVisit" FROM members ORDER BY id ASC`,
        sql`SELECT id, member_id AS "memberId", member_name AS "memberName", type, description AS "desc", date, amount::int AS amount, payment_method AS "paymentMethod", previous_end_date AS "previousEndDate", previous_start_date AS "previousStartDate", previous_package_id AS "previousPackageId" FROM transactions ORDER BY created_at DESC`,
        sql`SELECT id, member_id AS "memberId", member_name AS "memberName", phone, date, time, status_at_check_in AS "statusAtCheckIn", visit_number AS "visitNumber" FROM attendance_logs ORDER BY created_at DESC`,
        sql`SELECT id, date, description AS "desc", amount::int AS amount, payment_method AS "paymentMethod" FROM expenses ORDER BY created_at DESC`,
        sql`SELECT id, name, phone, date, amount_paid::int AS "amountPaid", payment_method AS "paymentMethod" FROM daily_visitors ORDER BY created_at DESC`
      ]);
      return res.status(200).json({ members, transactions, attendanceLogs, expenses, dailyVisitors });
    }

    if (action === 'saveMember') {
      const m = payload;
      await sql`
        INSERT INTO members (id, name, phone, package_id, start_date, end_date, total_visits, history_count, last_visit)
        VALUES (${m.id}, ${m.name}, ${m.phone || '-'}, ${m.packageId || 'pkg-1'}, ${m.startDate || ''}, ${m.endDate || ''}, ${m.totalVisits || 0}, ${m.historyCount || 1}, ${m.lastVisit || null})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          phone = EXCLUDED.phone,
          package_id = EXCLUDED.package_id,
          start_date = EXCLUDED.start_date,
          end_date = EXCLUDED.end_date,
          total_visits = EXCLUDED.total_visits,
          history_count = EXCLUDED.history_count,
          last_visit = EXCLUDED.last_visit,
          updated_at = NOW();
      `;
      return res.status(200).json({ success: true });
    }

    if (action === 'deleteMember') {
      await sql`DELETE FROM members WHERE id = ${payload.id}`;
      return res.status(200).json({ success: true });
    }

    if (action === 'saveTransaction') {
      const t = payload;
      await sql`
        INSERT INTO transactions (id, member_id, member_name, type, description, date, amount, payment_method, previous_end_date, previous_start_date, previous_package_id)
        VALUES (${t.id}, ${t.memberId || null}, ${t.memberName}, ${t.type}, ${t.desc || ''}, ${t.date}, ${t.amount || 0}, ${t.paymentMethod || 'Cash'}, ${t.previousEndDate || null}, ${t.previousStartDate || null}, ${t.previousPackageId || null})
        ON CONFLICT (id) DO NOTHING;
      `;
      return res.status(200).json({ success: true });
    }

    if (action === 'deleteTransaction') {
      await sql`DELETE FROM transactions WHERE id = ${payload.id}`;
      return res.status(200).json({ success: true });
    }

    if (action === 'saveAttendance') {
      const a = payload;
      await sql`
        INSERT INTO attendance_logs (id, member_id, member_name, phone, date, time, status_at_check_in, visit_number)
        VALUES (${a.id}, ${a.memberId}, ${a.memberName}, ${a.phone || '-'}, ${a.date}, ${a.time}, ${a.statusAtCheckIn}, ${a.visitNumber || 1})
        ON CONFLICT (id) DO NOTHING;
      `;
      return res.status(200).json({ success: true });
    }

    if (action === 'deleteAttendance') {
      await sql`DELETE FROM attendance_logs WHERE id = ${payload.id}`;
      return res.status(200).json({ success: true });
    }

    if (action === 'saveExpense') {
      const e = payload;
      await sql`
        INSERT INTO expenses (id, date, description, amount, payment_method)
        VALUES (${e.id}, ${e.date}, ${e.desc}, ${e.amount || 0}, ${e.paymentMethod || 'Cash'})
        ON CONFLICT (id) DO UPDATE SET
          date = EXCLUDED.date,
          description = EXCLUDED.description,
          amount = EXCLUDED.amount,
          payment_method = EXCLUDED.payment_method;
      `;
      return res.status(200).json({ success: true });
    }

    if (action === 'deleteExpense') {
      await sql`DELETE FROM expenses WHERE id = ${payload.id}`;
      return res.status(200).json({ success: true });
    }

    if (action === 'saveDailyVisitor') {
      const d = payload;
      await sql`
        INSERT INTO daily_visitors (id, name, phone, date, amount_paid, payment_method)
        VALUES (${d.id}, ${d.name}, ${d.phone || '-'}, ${d.date}, ${d.amountPaid || 35000}, ${d.paymentMethod || 'Cash'})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          phone = EXCLUDED.phone,
          date = EXCLUDED.date,
          amount_paid = EXCLUDED.amount_paid,
          payment_method = EXCLUDED.payment_method;
      `;
      return res.status(200).json({ success: true });
    }

    if (action === 'deleteDailyVisitor') {
      await sql`DELETE FROM daily_visitors WHERE id = ${payload.id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
