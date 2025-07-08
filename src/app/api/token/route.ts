import midtransClient from 'midtrans-client'
import { NextRequest, NextResponse } from 'next/server'

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.NEXT_MIDTRANS_SERVER_KEY as string,
  clientKey: process.env.NEXT_MIDTRANS_CLIENT_KEY as string,
})

export async function POST(req: NextRequest) {
  const { gross_amount, order_id } = await req.json()

    const parameter = {
    transaction_details: {
      order_id,
      gross_amount,
    },
    enabled_payments: ['other_qris'],
  }

  try {
    const transaction = await snap.createTransaction(parameter)
    return NextResponse.json({ token: transaction.token }, { status: 401 })
  } catch (error) {
    console.error('Midtrans Error:', error)
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
