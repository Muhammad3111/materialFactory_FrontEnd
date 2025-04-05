import CheckInButton from "../attendance/CheckIn";
import CheckOutButton from "../attendance/CheckOut";
import DailyWorkForm from "../attendance/DailyWorkForm";
import ReadWorks from "../attendance/ReadWorks";

export default function StaffDashboard() {
  return (
    <div className="pt-16 flex flex-col gap-6 items-center">
      <h1 className="text-2xl font-bold">Ishchi Paneli</h1>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <CheckInButton />
        <CheckOutButton />
        <DailyWorkForm />
        <ReadWorks />
      </div>
    </div>
  );
}
