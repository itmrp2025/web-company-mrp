import { TeamPageEditor } from "@/components/admin/pages/TeamPageEditor";

export default function AdminPageTeamPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Halaman Tim</h1>
        <p className="mt-0.5 text-sm text-neutral-500">
          Kelola konten tiap section halaman Our Team
        </p>
      </div>
      <TeamPageEditor />
    </div>
  );
}
