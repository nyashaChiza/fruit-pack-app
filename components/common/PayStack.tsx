import React from 'react';
import { View, Button } from 'react-native';
import { usePaystack } from 'react-native-paystack-webview';

type Props = {
  userEmail: string;
  orderId: string;
  amountZAR: number; // e.g. 100 = ZAR 100.00
};

const PaymentComponent: React.FC<Props> = ({ userEmail, orderId, amountZAR }) => {
  const { popup } = usePaystack();

  const payNow = () => {
    popup.checkout({
      email: userEmail,
      amount: amountZAR * 100, // convert to cents
      reference: `ORDER_${orderId}_${Date.now()}`,
      metadata: {
        cart_id: orderId,
        custom_fields: [
          {
            display_name: 'Order ID',
            variable_name: 'order_id',
            value: orderId,
          },
        ],
      },
      onSuccess: (res) => console.log('Payment Success:', res),
      onCancel: () => console.log('Payment Cancelled'),
      onError: (err) => console.error('Payment Error:', err),
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Button title={`Pay ZAR ${amountZAR}`} onPress={payNow} />
    </View>
  );
};

export default PaymentComponent;
