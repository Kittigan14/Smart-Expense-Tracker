import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { transactions, question } = await req.json()

  const summary = transactions
    .slice(0, 50) 
    .map((t: any) =>
      `${t.date} | ${t.category} | ${t.amount} บาท | ${t.note}`
    )
    .join('\n')

  const prompt = `คุณเป็น AI ที่ช่วยวิเคราะห์ค่าใช้จ่าย
ข้อมูลค่าใช้จ่ายของผู้ใช้:
${summary}

คำถาม: ${question}
ตอบเป็นภาษาไทย กระชับ เข้าใจง่าย ไม่เกิน 3 ย่อหน้า`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  )

  const data = await res.json()
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'ไม่สามารถวิเคราะห์ได้'

  return NextResponse.json({ result: text })
}