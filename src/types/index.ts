export interface Project {
  id: string;
  title: string;
  client_name: string;
  category: string;
  description: string;
  image_url: string;
  live_url?: string | null;
  tags: string[];
  results_metric?: string | null;
  featured: boolean;
  order_index: number;
  created_at?: string | null;
}

export interface Client {
  id: string;
  business_name: string;
  contact_name: string;
  phone: string;
  email?: string | null;
  location: string;
  package_selected: string;
  status: 'Lead' | 'In Progress' | 'Active' | 'Completed' | string;
  total_billed: number;
  notes?: string | null;
  created_at?: string | null;
}

export interface Payment {
  id: string;
  client_id?: string | null;
  client_name: string;
  project_title: string;
  invoice_number: string;
  total_amount: number;
  paid_amount: number;
  due_date: string;
  payment_method: string;
  status: 'Paid' | 'Partial' | 'Pending' | string;
  created_at?: string | null;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_phone?: string | null;
  client_email?: string | null;
  client_address?: string | null;
  issue_date: string;
  due_date: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total_amount: number;
  status: 'Draft' | 'Issued' | 'Paid' | 'Cancelled' | string;
  notes?: string | null;
  created_at?: string | null;
}

export type LeadStatus = 'New' | 'Contacted' | 'Converted' | 'Dismissed';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  business: string | null;
  package: string | null;
  message: string | null;
  status: LeadStatus;
  converted_client_id: string | null;
  created_at: string;
}

export interface LeadInput {
  name: string;
  phone: string;
  business?: string;
  package?: string;
  message?: string;
}
