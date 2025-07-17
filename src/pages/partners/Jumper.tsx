import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type StateProps = {
  id: number;
  partner: string;
  phone: string;
};

export default function Jumper() {
  const [info, setInfo] = useState<StateProps | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const partnerInfo = location.state as StateProps | undefined;
    if (partnerInfo?.id && partnerInfo.partner) {
      setInfo(partnerInfo);
    }
  }, [location.state]);

  return (
    <div className="flex flex-col gap-4 py-20 px-4">
      <div
        className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4 cursor-pointer"
        onClick={() =>
          navigate(`/inventory`, {
            state: info || {},
          })
        }
      >
        <span className="text-lg font-semibold">Ombor</span>
      </div>
      <div
        className="p-4 rounded-2xl bg-white shadow-md border flex items-center gap-4 cursor-pointer"
        onClick={() =>
          navigate(`/transactions`, {
            state: info || {},
          })
        }
      >
        <span className="text-lg font-semibold">Hisobotlar</span>
      </div>
    </div>
  );
}
