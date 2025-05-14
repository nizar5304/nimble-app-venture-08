
import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Define subscription plan type
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  duration_days: number;
}

const Subscription = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .order('price');
          
        if (error) {
          throw error;
        }
        
        setPlans(data || []);
      } catch (error: any) {
        toast({
          title: "Error loading plans",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);
  
  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    
    // In a real implementation, we would initialize Razorpay here
    const options = {
      key: 'rzp_test_YOUR_KEY_HERE', // Replace with actual test key
      amount: plan.price * 100, // Razorpay expects amount in paise
      currency: 'INR',
      name: 'PhoneMetrics',
      description: `${plan.name} Plan - ${plan.duration_days} days`,
      image: 'https://example.com/your_logo.png',
      prefill: {
        email: user?.email,
      },
      handler: (response: any) => {
        // Handle payment success
        handlePaymentSuccess(plan.id, response.razorpay_payment_id);
      },
      theme: {
        color: '#c2446e',
      },
    };

    // In a real implementation, we would load and open Razorpay here
    toast({
      title: "Razorpay Integration",
      description: `This would open Razorpay for the ${plan.name} plan (₹${(plan.price / 100).toLocaleString('en-IN')})`,
    });
  };
  
  const handlePaymentSuccess = async (planId: string, paymentId: string) => {
    try {
      // Record the payment
      const { error: paymentError } = await supabase
        .from('payment_logs')
        .insert({
          user_id: user?.id,
          payment_id: paymentId,
          amount: selectedPlan?.price || 0,
          status: 'success',
        });
        
      if (paymentError) throw paymentError;
      
      // Create subscription
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (selectedPlan?.duration_days || 30));
      
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user?.id,
          plan_id: planId,
          status: 'active',
          end_date: endDate.toISOString(),
          payment_id: paymentId,
        });
        
      if (subscriptionError) throw subscriptionError;
      
      toast({
        title: "Subscription Activated",
        description: `Your ${selectedPlan?.name} plan is now active!`,
      });
      
    } catch (error: any) {
      toast({
        title: "Error processing subscription",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <MobileLayout title="Subscription Plans" showBackButton>
        <div className="p-4 flex justify-center">
          <div className="animate-pulse">Loading subscription plans...</div>
        </div>
      </MobileLayout>
    );
  }
  
  return (
    <MobileLayout title="Subscription Plans" showBackButton>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Choose Your Plan</h2>
        
        <div className="space-y-4">
          {plans.map((plan) => (
            <Card key={plan.id} className={selectedPlan?.id === plan.id ? "border-[#c2446e] border-2" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>{plan.name}</span>
                  <span className="text-[#c2446e]">₹{(plan.price / 100).toLocaleString('en-IN')}</span>
                </CardTitle>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="pb-2">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full bg-[#c2446e] hover:bg-[#a03759]" 
                  onClick={() => handleSelectPlan(plan)}
                >
                  Select Plan
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>All plans include a {plans[0]?.duration_days || 30}-day subscription</p>
          <p className="mt-1">Payments processed securely through Razorpay</p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Subscription;
