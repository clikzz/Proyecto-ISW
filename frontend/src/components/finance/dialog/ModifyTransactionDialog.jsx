import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { modifyTransactionValidation } from '@/validations/modifyTransaction';
import { updateTransaction } from '@/api/transaction';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ModifyTransactionDialog({ isOpen, onClose, onTransactionUpdated, transaction }) {
  if (!transaction) {
    return null;
  }

  const initialValues = {
    transaction_type: transaction.transaction_type,
    amount: transaction.amount,
    payment_method: transaction.payment_method,
    description: transaction.description,
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const updatedTransaction = await updateTransaction(transaction.id_transaction, values);
      onTransactionUpdated(updatedTransaction);
      onClose();
    } catch (error) {
      console.error('Error al actualizar la transacción:', error);
      setStatus('Error al actualizar la transacción.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '-') {
      event.preventDefault();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground border-none">
        <DialogHeader>
          <DialogTitle>Modificar Movimiento</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={modifyTransactionValidation}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status, setFieldValue, values }) => (
            <Form className="space-y-4">
              {status && <div className="text-red-500">{status}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction_type">Tipo de Movimiento</Label>
                  <Select
                    value={values.transaction_type}
                    onValueChange={(value) => setFieldValue('transaction_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ingreso">Ingreso</SelectItem>
                      <SelectItem value="egreso">Egreso</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMessage name="transaction_type" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Monto</Label>
                  <Field
                    as={Input}
                    type="number"
                    id="amount"
                    name="amount"
                    placeholder="Ingrese el monto"
                    onKeyDown={handleKeyDown}
                  />
                  <ErrorMessage name="amount" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_method">Método de Pago</Label>
                <Select
                  value={values.payment_method}
                  onValueChange={(value) => setFieldValue('payment_method', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage name="payment_method" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Field
                  as={Input}
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Ingrese una descripción"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Procesando...' : 'Actualizar Movimiento'}
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
