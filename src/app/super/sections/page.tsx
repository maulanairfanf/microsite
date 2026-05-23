import { redirect } from 'next/navigation';

export default async function AdminSectionsPage() {
  redirect('/admin/tenants');
}