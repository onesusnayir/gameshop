import midtransClient from 'midtrans-client'
import { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import supabaseClient from '@/lib/supabaseClient'

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.NEXT_MIDTRANS_SERVER_KEY as string,
  clientKey: process.env.NEXT_MIDTRANS_CLIENT_KEY as string,
})

async function createToken(gross_amount: number): Promise<{ token: string, orderId: string }> {
  const rawUuid = uuidv4().split('-')[0]
  const orderId = `ORDER-${Date.now()}-${rawUuid}`

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount,
    },
    enabled_payments: ['other_qris'],
  }

  try {
    const transaction = await snap.createTransaction(parameter)
    return { token: transaction.token , orderId }
  } catch (error) {
    console.error('Midtrans Error:', error)
    throw new Error('Failed to create transaction')
  }
}

export async function POST(req: NextRequest) {
  const { gross_amount, game_id } = await req.json()

  try {
    const data = await createToken(gross_amount)

    return Response.json({ token: data.token, orderId: data.orderId })
  } catch (e) {
    return new Response('Failed to create transaction', { status: 500 })
  }
}
