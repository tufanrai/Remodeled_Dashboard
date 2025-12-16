import DashboardLayout from "@/components/layout/DashboardLayout";
import UploadReportsForm from "@/components/cards/UploadReportsForm";
import ReportsListCard from "@/components/cards/ReportsListCard";

const UploadReports = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold tracking-tight">Upload Reports</h1>
          <p className="text-muted-foreground">
            Upload annual and semi-annual reports
          </p>
        </div>

        <div className="max-w-2xl">
          <UploadReportsForm />
        </div>

        <div className="max-w-2xl">
          <ReportsListCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadReports;
