'use server';

import { getGraphQLServerClient } from '@/lib/graphql/server';
import { addMonths } from 'date-fns';
import { RECURRENCE_MONTHS_MAP } from '@/lib/payment-utils';
import { v4 as uuidv4 } from 'uuid';

export interface GeneratePaymentsParams {
  studentId: string;
  planId: string;
  planName: string;
  price: number;
  recurrence: string;
  numberOfInstallments: number;
  startDate?: Date;
}

export interface GeneratePaymentsResult {
  success: boolean;
  message: string;
  paymentsCreated?: number;
}

/**
 * Gera múltiplas ordens de pagamento (mensalidades) para um aluno com base no plano contratado
 */
export async function generatePaymentOrders(
  params: GeneratePaymentsParams
): Promise<GeneratePaymentsResult> {
  const {
    studentId,
    planId,
    planName,
    price,
    recurrence,
    numberOfInstallments,
    startDate = new Date(),
  } = params;

  try {
    const client = getGraphQLServerClient();

    // Validar recorrência
    const monthsInterval = RECURRENCE_MONTHS_MAP[recurrence];
    if (!monthsInterval) {
      return {
        success: false,
        message: `Recorrência inválida: ${recurrence}`,
      };
    }

    // Validar número de parcelas
    if (numberOfInstallments < 1 || numberOfInstallments > 24) {
      return {
        success: false,
        message: 'O número de parcelas deve estar entre 1 e 24',
      };
    }

    // Gerar as ordens de pagamento
    const payments = [];
    let currentDueDate = new Date(startDate);
    currentDueDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < numberOfInstallments; i++) {
      // Calcular a data de vencimento para esta parcela
      const paymentDate = addMonths(currentDueDate, i * monthsInterval);

      payments.push({
        id: uuidv4(),
        student_id: studentId,
        amount: price,
        payment_date: paymentDate.toISOString(),
        payment_method: null,
        status: 'pendente',
      });
    }

    // Inserir todos os pagamentos de uma vez
    const mutation = `
      mutation InsertPayments($objects: [payments_insert_input!]!) {
        insert_payments(objects: $objects) {
          affected_rows
          returning {
            id
            payment_date
            amount
            status
          }
        }
      }
    `;

    const result = await client.request(mutation, { objects: payments });

    const affectedRows = result.insert_payments?.affected_rows || 0;

    if (affectedRows > 0) {
      return {
        success: true,
        message: `${affectedRows} ordem(ns) de pagamento gerada(s) com sucesso!`,
        paymentsCreated: affectedRows,
      };
    } else {
      return {
        success: false,
        message: 'Nenhuma ordem de pagamento foi criada',
      };
    }
  } catch (error: any) {
    console.error('Error generating payment orders (GraphQL):', error);
    return {
      success: false,
      message: error.message || 'Erro ao gerar ordens de pagamento',
    };
  }
}

