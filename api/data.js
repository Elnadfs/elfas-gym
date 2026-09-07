import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "https://bbpoecfwqjcmmvtwiwed.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicG9lY2Z3cWpjbW12dHdpd2VkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODc4Mjc4NiwiZXhwIjoyMTA0MzU4Nzg2fQ.EgKBNt9SxnGywlNpaO6uZ9PsOFdf2epkgiPtsXjpzxY"
);

const remap = {
  member: (m) => m ? ({
    ...m,
    packageId: m.package_id || m.packageId,
    startDate: m.start_date || m.startDate,
    endDate: m.end_date || m.endDate,
    totalVisits: m.total_visits ?? m.totalVisits,
    historyCount: m.history_count ?? m.historyCount,
    lastVisit: m.last_visit || m.lastVisit,
  }) : null,
  transaction: (t) => t ? ({
    ...t,
    memberId: t.member_id || t.memberId,
    memberName: t.member_name || t.memberName,
    desc: t.description || t.desc,
    paymentMethod: t.payment_method || t.paymentMethod,
    previousEndDate: t.previous_end_date || t.previousEndDate,
    previousStartDate: t.previous_start_date || t.previousStartDate,
    previousPackageId: t.previous_package_id || t.previousPackageId,
  }) : null,
  attendance: (a) => a ? ({
    ...a,
    memberId: a.member_id || a.memberId,
    memberName: a.member_name || a.memberName,
    statusAtCheckIn: a.status_at_check_in || a.statusAtCheckIn,
    visitNumber: a.visit_number ?? a.visitNumber,
  }) : null,
  expense: (e) => e ? ({
    ...e,
    desc: e.description || e.desc,
    paymentMethod: e.payment_method || e.paymentMethod,
  }) : null,
  visitor: (v) => v ? ({
    ...v,
    amountPaid: v.amount_paid ?? v.amountPaid,
    paymentMethod: v.payment_method || v.paymentMethod,
  }) : null,
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
  if (req.method === "OPTIONS") return res.status(200).end();

  let action, payload;
  if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    action = body.action || "fetchAll";
    payload = body.payload;
  } else {
    action = req.query?.action || "fetchAll";
  }

  try {
    if (action === "fetchAll") {
      const [m, t, a, e, v, p, pr, s] = await Promise.all([
        supabase.from("members").select("id,name,phone,package_id,start_date,end_date,total_visits,history_count,last_visit").order("id").limit(20000),
        supabase.from("transactions").select("id,member_id,member_name,type,description,date,amount,payment_method,previous_end_date,previous_start_date,previous_package_id").order("created_at", { ascending: false }).limit(20000),
        supabase.from("attendance_logs").select("id,member_id,member_name,phone,date,time,status_at_check_in,visit_number").order("created_at", { ascending: false }).limit(20000),
        supabase.from("expenses").select("id,date,description,amount,payment_method").order("created_at", { ascending: false }).limit(5000),
        supabase.from("daily_visitors").select("id,name,phone,date,amount_paid,payment_method").order("created_at", { ascending: false }).limit(20000),
        supabase.from("packages").select("id,name,duration,price").order("created_at"),
        supabase.from("products").select("id,name,price,stock").order("created_at"),
        supabase.from("settings").select("key,value"),
      ]);
      const settingsObj = {};
      if (s.data) s.data.forEach(r => { settingsObj[r.key] = r.value; });
      return res.status(200).json({
        members: (m.data || []).map(remap.member),
        transactions: (t.data || []).map(remap.transaction),
        attendanceLogs: (a.data || []).map(remap.attendance),
        expenses: (e.data || []).map(remap.expense),
        dailyVisitors: (v.data || []).map(remap.visitor),
        packages: p.data || [],
        products: pr.data || [],
        settings: settingsObj,
      });
    }

    if (action === "saveMember") {
      const m = payload;
      const { error } = await supabase.from("members").upsert({
        id: m.id, name: m.name || "Member", phone: m.phone || "-",
        package_id: m.packageId || "pkg-1", start_date: m.startDate || "",
        end_date: m.endDate || "", total_visits: m.totalVisits || 0,
        history_count: m.historyCount || 1, last_visit: m.lastVisit || null,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (action === "deleteMember") {
      const { error } = await supabase.from("members").delete().eq("id", payload.id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (action === "saveTransaction") {
      const t = payload;
      const { error } = await supabase.from("transactions").upsert({
        id: t.id, member_id: t.memberId || null, member_name: t.memberName,
        type: t.type, description: t.desc || "", date: t.date,
        amount: t.amount || 0, payment_method: t.paymentMethod || "Cash",
        previous_end_date: t.previousEndDate || null,
        previous_start_date: t.previousStartDate || null,
        previous_package_id: t.previousPackageId || null,
      }, { onConflict: "id", ignoreDuplicates: true });
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (action === "deleteTransaction") {
      const { error } = await supabase.from("transactions").delete().eq("id", payload.id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (action === "saveAttendance") {
      const a = payload;
      const { error } = await supabase.from("attendance_logs").upsert({
        id: a.id, member_id: a.memberId, member_name: a.memberName,
        phone: a.phone || "-", date: a.date, time: a.time,
        status_at_check_in: a.statusAtCheckIn, visit_number: a.visitNumber || 1,
      }, { onConflict: "id", ignoreDuplicates: true });
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (action === "deleteAttendance") {
      const { error } = await supabase.from("attendance_logs").delete().eq("id", payload.id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (action === "saveExpense") {
      const e = payload;
      const { error } = await supabase.from("expenses").upsert({
        id: e.id, date: e.date, description: e.desc,
        amount: e.amount || 0, payment_method: e.paymentMethod || "Cash",
      });
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (action === "deleteExpense") {
      const { error } = await supabase.from("expenses").delete().eq("id", payload.id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (action === "saveDailyVisitor") {
      const d = payload;
      const { error } = await supabase.from("daily_visitors").upsert({
        id: d.id, name: d.name, phone: d.phone || "-",
        date: d.date, amount_paid: d.amountPaid || 35000,
        payment_method: d.paymentMethod || "Cash",
      });
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (action === "deleteDailyVisitor") {
      const { error } = await supabase.from("daily_visitors").delete().eq("id", payload.id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (action === "savePackage") {
      const p = payload;
      const { error } = await supabase.from("packages").upsert({
        id: p.id, name: p.name, duration: p.duration || 1, price: p.price || 0,
      });
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (action === "deletePackage") {
      const { error } = await supabase.from("packages").delete().eq("id", payload.id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (action === "saveProduct") {
      const p = payload;
      const { error } = await supabase.from("products").upsert({
        id: p.id, name: p.name, price: p.price || 0, stock: p.stock || 0,
      });
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (action === "deleteProduct") {
      const { error } = await supabase.from("products").delete().eq("id", payload.id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (action === "saveSetting") {
      const { key, value } = payload;
      const { error } = await supabase.from("settings").upsert({
        key, value: String(value), updated_at: new Date().toISOString()
      });
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
