
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockDepartments } from '@/data/mockData';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate AD authentication (in a real app, this would call an authentication service)
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "You are now logged in as an administrator",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Invalid username or password",
      });
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Administrator Login</CardTitle>
            <CardDescription>Login with your Microsoft account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use admin/admin for demo purposes
                  </p>
                </div>
                <Button type="submit" className="w-full">Login</Button>
                <div className="mt-2">
                  <Link to="/" className="text-sm text-primary hover:text-primary/80 flex items-center">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back to Directory
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Directory Administration</h1>
            <p className="text-muted-foreground">Manage the service directory structure and content</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAuthenticated(false)}
            >
              Logout
            </Button>
            <Link to="/">
              <Button variant="secondary" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Directory
              </Button>
            </Link>
          </div>
        </div>
        
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Demo Mode</AlertTitle>
          <AlertDescription>
            This is a demonstration interface. Changes are not persisted.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="departments" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
          
          <TabsContent value="departments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Departments</CardTitle>
                <CardDescription>
                  Add, edit, or remove departments from the directory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDepartments.map((dept) => (
                    <div key={dept.id} className="p-4 border rounded-md border-border bg-card/50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-foreground">{dept.name}</h3>
                          <p className="text-sm text-muted-foreground">{dept.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="font-medium mb-4 text-foreground">Add New Department</h3>
                    <form className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="dept-name">Department Name</Label>
                        <Input id="dept-name" placeholder="Enter department name" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dept-desc">Description</Label>
                        <Textarea id="dept-desc" placeholder="Enter department description" />
                      </div>
                      <Button type="button">Add Department</Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Categories</CardTitle>
                <CardDescription>
                  Add, edit, or remove categories within departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">
                  Select a department to manage its categories
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subcategories" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Subcategories</CardTitle>
                <CardDescription>
                  Add, edit, or remove subcategories within categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">
                  Select a category to manage its subcategories
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Services</CardTitle>
                <CardDescription>
                  Add, edit, or remove services within subcategories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">
                  Select a subcategory to manage its services
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
