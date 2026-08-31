import { Card, CardContent, CardHeader, CardTitle } from "@/components/custom-ui/Card";

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Selamat datang</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-500">
            CMS admin dashboard akan dibangun di Phase 2.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
