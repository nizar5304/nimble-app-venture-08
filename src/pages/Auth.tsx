
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users } from 'lucide-react';

const Auth = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#c2446e]">PhoneMetrics</CardTitle>
          <CardDescription>
            Mobile shop management made easy
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold">Choose Login Type</h2>
          </div>

          <Link to="/auth" className="block w-full">
            <Button 
              className="w-full h-16 text-lg justify-start p-6 bg-[#c2446e] hover:bg-[#a03759]" 
              variant="default"
            >
              <Users className="h-6 w-6 mr-4" />
              <div className="text-left">
                <div className="font-medium">Users</div>
                <div className="text-xs opacity-90">Shop owners and staff</div>
              </div>
            </Button>
          </Link>

          <Link to="/admin/login" className="block w-full">
            <Button 
              className="w-full h-16 text-lg justify-start p-6" 
              variant="outline"
            >
              <ShieldCheck className="h-6 w-6 mr-4" />
              <div className="text-left">
                <div className="font-medium">Administrators</div>
                <div className="text-xs opacity-90">System administrators only</div>
              </div>
            </Button>
          </Link>
        </CardContent>

        <CardFooter className="text-center text-sm text-muted-foreground flex-col space-y-2">
          <p>Select the appropriate login based on your role</p>
          <div className="border-t pt-2 w-full">
            <p>Demo accounts:</p>
            <p>Admin: admin@example.com / password123</p>
            <p>Owner: owner@example.com / password123</p>
            <p>Staff: staff@example.com / password123</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
