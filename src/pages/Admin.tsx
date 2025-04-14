
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ChevronLeft, Plus, Trash, Edit, Search, FilterIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockDepartments } from '@/data/mockData';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Department, Category, Subcategory, Service } from '@/types/directory';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Data state
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  
  // Filter state
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  
  // Form state
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newDepartmentDesc, setNewDepartmentDesc] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategoryDesc, setNewSubcategoryDesc] = useState('');
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceLink, setNewServiceLink] = useState('');
  const [newServiceEmail, setNewServiceEmail] = useState('');
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('departments');
  
  // Initialize data
  useEffect(() => {
    setDepartments([...mockDepartments]);
    
    // Set default selections if departments exist
    if (mockDepartments.length > 0) {
      setSelectedDepartment(mockDepartments[0].id);
      
      if (mockDepartments[0].categories.length > 0) {
        setSelectedCategory(mockDepartments[0].categories[0].id);
        
        if (mockDepartments[0].categories[0].subcategories.length > 0) {
          setSelectedSubcategory(mockDepartments[0].categories[0].subcategories[0].id);
        }
      }
    }
  }, []);
  
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
  
  // Helper functions for data management
  const addDepartment = () => {
    if (!newDepartmentName) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Department name is required",
      });
      return;
    }
    
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name: newDepartmentName,
      description: newDepartmentDesc,
      categories: []
    };
    
    setDepartments([...departments, newDept]);
    setNewDepartmentName('');
    setNewDepartmentDesc('');
    
    toast({
      title: "Department added",
      description: `${newDepartmentName} has been added to the directory`,
    });
  };
  
  const deleteDepartment = (id: string) => {
    setDepartments(departments.filter(dept => dept.id !== id));
    
    toast({
      title: "Department deleted",
      description: "The department has been removed from the directory",
    });
  };
  
  const addCategory = () => {
    if (!selectedDepartment || !newCategoryName) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Department and category name are required",
      });
      return;
    }
    
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: newCategoryName,
      description: newCategoryDesc,
      departmentId: selectedDepartment,
      subcategories: []
    };
    
    setDepartments(departments.map(dept => {
      if (dept.id === selectedDepartment) {
        return {
          ...dept,
          categories: [...dept.categories, newCategory]
        };
      }
      return dept;
    }));
    
    setNewCategoryName('');
    setNewCategoryDesc('');
    
    toast({
      title: "Category added",
      description: `${newCategoryName} has been added to the selected department`,
    });
  };
  
  const deleteCategory = (deptId: string, catId: string) => {
    setDepartments(departments.map(dept => {
      if (dept.id === deptId) {
        return {
          ...dept,
          categories: dept.categories.filter(cat => cat.id !== catId)
        };
      }
      return dept;
    }));
    
    toast({
      title: "Category deleted",
      description: "The category has been removed from the directory",
    });
  };
  
  const addSubcategory = () => {
    if (!selectedDepartment || !selectedCategory || !newSubcategoryName) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Department, category, and subcategory name are required",
      });
      return;
    }
    
    const newSubcategory: Subcategory = {
      id: `subcat-${Date.now()}`,
      name: newSubcategoryName,
      description: newSubcategoryDesc,
      categoryId: selectedCategory,
      services: []
    };
    
    setDepartments(departments.map(dept => {
      if (dept.id === selectedDepartment) {
        return {
          ...dept,
          categories: dept.categories.map(cat => {
            if (cat.id === selectedCategory) {
              return {
                ...cat,
                subcategories: [...cat.subcategories, newSubcategory]
              };
            }
            return cat;
          })
        };
      }
      return dept;
    }));
    
    setNewSubcategoryName('');
    setNewSubcategoryDesc('');
    
    toast({
      title: "Subcategory added",
      description: `${newSubcategoryName} has been added to the selected category`,
    });
  };
  
  const deleteSubcategory = (deptId: string, catId: string, subcatId: string) => {
    setDepartments(departments.map(dept => {
      if (dept.id === deptId) {
        return {
          ...dept,
          categories: dept.categories.map(cat => {
            if (cat.id === catId) {
              return {
                ...cat,
                subcategories: cat.subcategories.filter(subcat => subcat.id !== subcatId)
              };
            }
            return cat;
          })
        };
      }
      return dept;
    }));
    
    toast({
      title: "Subcategory deleted",
      description: "The subcategory has been removed from the directory",
    });
  };
  
  const addService = () => {
    if (!selectedDepartment || !selectedCategory || !selectedSubcategory || !newServiceName) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Department, category, subcategory, and service name are required",
      });
      return;
    }
    
    const newService: Service = {
      id: `serv-${Date.now()}`,
      name: newServiceName,
      description: newServiceDesc,
      link: newServiceLink || undefined,
      contactEmail: newServiceEmail || undefined,
      subcategoryId: selectedSubcategory
    };
    
    setDepartments(departments.map(dept => {
      if (dept.id === selectedDepartment) {
        return {
          ...dept,
          categories: dept.categories.map(cat => {
            if (cat.id === selectedCategory) {
              return {
                ...cat,
                subcategories: cat.subcategories.map(subcat => {
                  if (subcat.id === selectedSubcategory) {
                    return {
                      ...subcat,
                      services: [...subcat.services, newService]
                    };
                  }
                  return subcat;
                })
              };
            }
            return cat;
          })
        };
      }
      return dept;
    }));
    
    setNewServiceName('');
    setNewServiceDesc('');
    setNewServiceLink('');
    setNewServiceEmail('');
    
    toast({
      title: "Service added",
      description: `${newServiceName} has been added to the selected subcategory`,
    });
  };
  
  const deleteService = (deptId: string, catId: string, subcatId: string, serviceId: string) => {
    setDepartments(departments.map(dept => {
      if (dept.id === deptId) {
        return {
          ...dept,
          categories: dept.categories.map(cat => {
            if (cat.id === catId) {
              return {
                ...cat,
                subcategories: cat.subcategories.map(subcat => {
                  if (subcat.id === subcatId) {
                    return {
                      ...subcat,
                      services: subcat.services.filter(service => service.id !== serviceId)
                    };
                  }
                  return subcat;
                })
              };
            }
            return cat;
          })
        };
      }
      return dept;
    }));
    
    toast({
      title: "Service deleted",
      description: "The service has been removed from the directory",
    });
  };
  
  // Helper functions to find objects by ID
  const getSelectedDepartment = () => departments.find(d => d.id === selectedDepartment);
  
  const getSelectedCategory = () => {
    const dept = getSelectedDepartment();
    if (!dept) return null;
    return dept.categories.find(c => c.id === selectedCategory);
  };
  
  const getSelectedSubcategory = () => {
    const cat = getSelectedCategory();
    if (!cat) return null;
    return cat.subcategories.find(s => s.id === selectedSubcategory);
  };
  
  // Filter functions
  const filteredDepartments = departments.filter(dept => 
    !departmentFilter || dept.name.toLowerCase().includes(departmentFilter.toLowerCase())
  );
  
  const filteredCategories = selectedDepartment 
    ? getSelectedDepartment()?.categories.filter(cat => 
        !categoryFilter || cat.name.toLowerCase().includes(categoryFilter.toLowerCase())
      ) || []
    : [];
  
  const filteredSubcategories = selectedCategory
    ? getSelectedCategory()?.subcategories.filter(subcat => 
        !subcategoryFilter || subcat.name.toLowerCase().includes(subcategoryFilter.toLowerCase())
      ) || []
    : [];
  
  const filteredServices = selectedSubcategory
    ? getSelectedSubcategory()?.services.filter(service => 
        !serviceFilter || service.name.toLowerCase().includes(serviceFilter.toLowerCase())
      ) || []
    : [];
  
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
  
  // Breadcrumb paths
  const getBreadcrumbPath = () => {
    const paths = [{ name: 'Admin', path: '/admin' }];
    
    if (activeTab === 'departments') {
      paths.push({ name: 'Departments', path: '/admin/departments' });
    } else if (activeTab === 'categories') {
      paths.push({ name: 'Categories', path: '/admin/categories' });
      if (selectedDepartment) {
        const dept = getSelectedDepartment();
        if (dept) paths.push({ name: dept.name, path: `/admin/categories/${dept.id}` });
      }
    } else if (activeTab === 'subcategories') {
      paths.push({ name: 'Subcategories', path: '/admin/subcategories' });
      if (selectedDepartment) {
        const dept = getSelectedDepartment();
        if (dept) {
          paths.push({ name: dept.name, path: `/admin/subcategories/${dept.id}` });
          if (selectedCategory) {
            const cat = getSelectedCategory();
            if (cat) paths.push({ name: cat.name, path: `/admin/subcategories/${dept.id}/${cat.id}` });
          }
        }
      }
    } else if (activeTab === 'services') {
      paths.push({ name: 'Services', path: '/admin/services' });
      if (selectedDepartment) {
        const dept = getSelectedDepartment();
        if (dept) {
          paths.push({ name: dept.name, path: `/admin/services/${dept.id}` });
          if (selectedCategory) {
            const cat = getSelectedCategory();
            if (cat) {
              paths.push({ name: cat.name, path: `/admin/services/${dept.id}/${cat.id}` });
              if (selectedSubcategory) {
                const subcat = getSelectedSubcategory();
                if (subcat) paths.push({ name: subcat.name, path: `/admin/services/${dept.id}/${cat.id}/${subcat.id}` });
              }
            }
          }
        }
      }
    }
    
    return paths;
  };
  
  const breadcrumbPaths = getBreadcrumbPath();
  
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
        
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            {breadcrumbPaths.map((path, index) => (
              <React.Fragment key={path.path}>
                {index < breadcrumbPaths.length - 1 ? (
                  <BreadcrumbItem>
                    <BreadcrumbLink href={path.path}>{path.name}</BreadcrumbLink>
                  </BreadcrumbItem>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{path.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
                
                {index < breadcrumbPaths.length - 1 && (
                  <BreadcrumbSeparator />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Demo Mode</AlertTitle>
          <AlertDescription>
            This is a demonstration interface. Changes are not persisted when you refresh the page.
          </AlertDescription>
        </Alert>
        
        <Tabs 
          defaultValue="departments" 
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
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
                <div className="mt-2 relative">
                  <Input
                    placeholder="Filter departments..."
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="pl-9"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDepartments.length > 0 ? (
                    filteredDepartments.map((dept) => (
                      <div key={dept.id} className="p-4 border rounded-md border-border bg-card/50 hover:bg-card transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-foreground">{dept.name}</h3>
                            <p className="text-sm text-muted-foreground">{dept.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Contains {dept.categories.length} {dept.categories.length === 1 ? 'category' : 'categories'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive border-destructive/20 hover:bg-destructive/10"
                              onClick={() => deleteDepartment(dept.id)}
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">
                      {departmentFilter 
                        ? "No departments match your filter" 
                        : "No departments found. Create your first one below."}
                    </p>
                  )}
                  
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="font-medium mb-4 text-foreground">Add New Department</h3>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); addDepartment(); }}>
                      <div className="grid gap-2">
                        <Label htmlFor="dept-name">Department Name</Label>
                        <Input 
                          id="dept-name" 
                          placeholder="Enter department name" 
                          value={newDepartmentName}
                          onChange={(e) => setNewDepartmentName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dept-desc">Description</Label>
                        <Textarea 
                          id="dept-desc" 
                          placeholder="Enter department description" 
                          value={newDepartmentDesc}
                          onChange={(e) => setNewDepartmentDesc(e.target.value)}
                        />
                      </div>
                      <Button type="submit">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Department
                      </Button>
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
                <div className="mb-6">
                  <Label htmlFor="select-department" className="block mb-2">Select Department</Label>
                  <Select 
                    value={selectedDepartment} 
                    onValueChange={setSelectedDepartment}
                  >
                    <SelectTrigger id="select-department" className="w-full">
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedDepartment ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">Categories in {getSelectedDepartment()?.name}</h3>
                      <div className="relative w-64">
                        <Input
                          placeholder="Filter categories..."
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="pl-9"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <div key={category.id} className="p-4 border rounded-md border-border bg-card/50 hover:bg-card transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium text-foreground">{category.name}</h3>
                              <p className="text-sm text-muted-foreground">{category.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Contains {category.subcategories.length} {category.subcategories.length === 1 ? 'subcategory' : 'subcategories'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-destructive border-destructive/20 hover:bg-destructive/10"
                                onClick={() => deleteCategory(selectedDepartment, category.id)}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">
                        {categoryFilter 
                          ? "No categories match your filter" 
                          : "No categories found in this department. Create your first one below."}
                      </p>
                    )}
                    
                    <div className="mt-6 pt-6 border-t border-border">
                      <h3 className="font-medium mb-4 text-foreground">Add New Category</h3>
                      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); addCategory(); }}>
                        <div className="grid gap-2">
                          <Label htmlFor="cat-name">Category Name</Label>
                          <Input 
                            id="cat-name" 
                            placeholder="Enter category name" 
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cat-desc">Description</Label>
                          <Textarea 
                            id="cat-desc" 
                            placeholder="Enter category description" 
                            value={newCategoryDesc}
                            onChange={(e) => setNewCategoryDesc(e.target.value)}
                          />
                        </div>
                        <Button type="submit">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Category
                        </Button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-12 text-muted-foreground">
                    Select a department to manage its categories
                  </p>
                )}
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
                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="select-department-sub" className="block mb-2">Select Department</Label>
                    <Select 
                      value={selectedDepartment} 
                      onValueChange={(value) => {
                        setSelectedDepartment(value);
                        // Get first category if available
                        const dept = departments.find(d => d.id === value);
                        if (dept && dept.categories.length > 0) {
                          setSelectedCategory(dept.categories[0].id);
                        } else {
                          setSelectedCategory('');
                        }
                      }}
                    >
                      <SelectTrigger id="select-department-sub" className="w-full">
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedDepartment && (
                    <div>
                      <Label htmlFor="select-category" className="block mb-2">Select Category</Label>
                      <Select 
                        value={selectedCategory} 
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger id="select-category" className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {getSelectedDepartment()?.categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                {selectedDepartment && selectedCategory ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">
                        Subcategories in {getSelectedCategory()?.name}
                      </h3>
                      <div className="relative w-64">
                        <Input
                          placeholder="Filter subcategories..."
                          value={subcategoryFilter}
                          onChange={(e) => setSubcategoryFilter(e.target.value)}
                          className="pl-9"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    {filteredSubcategories.length > 0 ? (
                      filteredSubcategories.map((subcategory) => (
                        <div key={subcategory.id} className="p-4 border rounded-md border-border bg-card/50 hover:bg-card transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium text-foreground">{subcategory.name}</h3>
                              <p className="text-sm text-muted-foreground">{subcategory.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Contains {subcategory.services.length} {subcategory.services.length === 1 ? 'service' : 'services'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-destructive border-destructive/20 hover:bg-destructive/10"
                                onClick={() => deleteSubcategory(selectedDepartment, selectedCategory, subcategory.id)}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">
                        {subcategoryFilter 
                          ? "No subcategories match your filter" 
                          : "No subcategories found in this category. Create your first one below."}
                      </p>
                    )}
                    
                    <div className="mt-6 pt-6 border-t border-border">
                      <h3 className="font-medium mb-4 text-foreground">Add New Subcategory</h3>
                      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); addSubcategory(); }}>
                        <div className="grid gap-2">
                          <Label htmlFor="subcat-name">Subcategory Name</Label>
                          <Input 
                            id="subcat-name" 
                            placeholder="Enter subcategory name" 
                            value={newSubcategoryName}
                            onChange={(e) => setNewSubcategoryName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="subcat-desc">Description</Label>
                          <Textarea 
                            id="subcat-desc" 
                            placeholder="Enter subcategory description" 
                            value={newSubcategoryDesc}
                            onChange={(e) => setNewSubcategoryDesc(e.target.value)}
                          />
                        </div>
                        <Button type="submit">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Subcategory
                        </Button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-12 text-muted-foreground">
                    Select a department and category to manage subcategories
                  </p>
                )}
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
                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="select-department-serv" className="block mb-2">Select Department</Label>
                    <Select 
                      value={selectedDepartment} 
                      onValueChange={(value) => {
                        setSelectedDepartment(value);
                        // Get first category if available
                        const dept = departments.find(d => d.id === value);
                        if (dept && dept.categories.length > 0) {
                          setSelectedCategory(dept.categories[0].id);
                          
                          // Get first subcategory if available
                          if (dept.categories[0].subcategories.length > 0) {
                            setSelectedSubcategory(dept.categories[0].subcategories[0].id);
                          } else {
                            setSelectedSubcategory('');
                          }
                        } else {
                          setSelectedCategory('');
                          setSelectedSubcategory('');
                        }
                      }}
                    >
                      <SelectTrigger id="select-department-serv" className="w-full">
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedDepartment && (
                    <div>
                      <Label htmlFor="select-category-serv" className="block mb-2">Select Category</Label>
                      <Select 
                        value={selectedCategory} 
                        onValueChange={(value) => {
                          setSelectedCategory(value);
                          // Get first subcategory if available
                          const dept = getSelectedDepartment();
                          if (dept) {
                            const cat = dept.categories.find(c => c.id === value);
                            if (cat && cat.subcategories.length > 0) {
                              setSelectedSubcategory(cat.subcategories[0].id);
                            } else {
                              setSelectedSubcategory('');
                            }
                          }
                        }}
                      >
                        <SelectTrigger id="select-category-serv" className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {getSelectedDepartment()?.categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {selectedDepartment && selectedCategory && (
                    <div>
                      <Label htmlFor="select-subcategory" className="block mb-2">Select Subcategory</Label>
                      <Select 
                        value={selectedSubcategory} 
                        onValueChange={setSelectedSubcategory}
                      >
                        <SelectTrigger id="select-subcategory" className="w-full">
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {getSelectedCategory()?.subcategories.map((subcat) => (
                            <SelectItem key={subcat.id} value={subcat.id}>{subcat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                {selectedDepartment && selectedCategory && selectedSubcategory ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">
                        Services in {getSelectedSubcategory()?.name}
                      </h3>
                      <div className="relative w-64">
                        <Input
                          placeholder="Filter services..."
                          value={serviceFilter}
                          onChange={(e) => setServiceFilter(e.target.value)}
                          className="pl-9"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    {filteredServices.length > 0 ? (
                      filteredServices.map((service) => (
                        <div key={service.id} className="p-4 border rounded-md border-border bg-card/50 hover:bg-card transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium text-foreground">{service.name}</h3>
                              <p className="text-sm text-muted-foreground">{service.description}</p>
                              {(service.link || service.contactEmail) && (
                                <div className="text-xs text-muted-foreground mt-1 space-y-1">
                                  {service.link && <p>Link: {service.link}</p>}
                                  {service.contactEmail && <p>Contact: {service.contactEmail}</p>}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-destructive border-destructive/20 hover:bg-destructive/10"
                                onClick={() => deleteService(selectedDepartment, selectedCategory, selectedSubcategory, service.id)}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">
                        {serviceFilter 
                          ? "No services match your filter" 
                          : "No services found in this subcategory. Create your first one below."}
                      </p>
                    )}
                    
                    <div className="mt-6 pt-6 border-t border-border">
                      <h3 className="font-medium mb-4 text-foreground">Add New Service</h3>
                      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); addService(); }}>
                        <div className="grid gap-2">
                          <Label htmlFor="service-name">Service Name</Label>
                          <Input 
                            id="service-name" 
                            placeholder="Enter service name" 
                            value={newServiceName}
                            onChange={(e) => setNewServiceName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="service-desc">Description</Label>
                          <Textarea 
                            id="service-desc" 
                            placeholder="Enter service description" 
                            value={newServiceDesc}
                            onChange={(e) => setNewServiceDesc(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="service-link">Service Link (optional)</Label>
                          <Input 
                            id="service-link" 
                            placeholder="https://example.com/service" 
                            value={newServiceLink}
                            onChange={(e) => setNewServiceLink(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="service-email">Contact Email (optional)</Label>
                          <Input 
                            id="service-email" 
                            placeholder="service@example.com" 
                            value={newServiceEmail}
                            onChange={(e) => setNewServiceEmail(e.target.value)}
                          />
                        </div>
                        <Button type="submit">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Service
                        </Button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-12 text-muted-foreground">
                    Select a department, category, and subcategory to manage services
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
