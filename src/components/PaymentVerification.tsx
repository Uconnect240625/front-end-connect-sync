
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface PaymentVerificationProps {
  amount: number;
  description: string;
  onPaymentComplete: () => void;
  onPaymentCancel: () => void;
}

const PaymentVerification = ({ 
  amount, 
  description, 
  onPaymentComplete, 
  onPaymentCancel 
}: PaymentVerificationProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | ''>('');
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (paymentMethod === 'upi' && !paymentDetails.upiId) {
      toast.error('Please enter UPI ID');
      return;
    }

    if (paymentMethod === 'card') {
      if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv || !paymentDetails.name) {
        toast.error('Please fill all card details');
        return;
      }
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Payment successful!');
      onPaymentComplete();
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          <span className="text-2xl">💳</span>
          <div className="mt-2">Payment Required</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">₹{amount}</div>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Select Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('upi')}
                className="flex items-center gap-2"
              >
                <span>📱</span>
                UPI
              </Button>
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('card')}
                className="flex items-center gap-2"
              >
                <span>💳</span>
                Card
              </Button>
            </div>
          </div>

          {paymentMethod === 'upi' && (
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="your@paytm"
                value={paymentDetails.upiId}
                onChange={(e) => setPaymentDetails(prev => ({ 
                  ...prev, 
                  upiId: e.target.value 
                }))}
              />
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => setPaymentDetails(prev => ({ 
                    ...prev, 
                    cardNumber: e.target.value 
                  }))}
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={paymentDetails.expiryDate}
                    onChange={(e) => setPaymentDetails(prev => ({ 
                      ...prev, 
                      expiryDate: e.target.value 
                    }))}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={paymentDetails.cvv}
                    onChange={(e) => setPaymentDetails(prev => ({ 
                      ...prev, 
                      cvv: e.target.value 
                    }))}
                    maxLength={3}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Cardholder Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={paymentDetails.name}
                  onChange={(e) => setPaymentDetails(prev => ({ 
                    ...prev, 
                    name: e.target.value 
                  }))}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handlePayment}
            disabled={isProcessing || !paymentMethod}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing...
              </>
            ) : (
              <>Pay ₹{amount}</>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onPaymentCancel}
            disabled={isProcessing}
            className="w-full"
          >
            Cancel
          </Button>
        </div>

        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            🔒 Secure Payment
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentVerification;
