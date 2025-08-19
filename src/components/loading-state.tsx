import { ThreeDots } from "react-loader-spinner";

export function Spinner() {
  return (
    <div className="flex justify-center items-center py-8 h-screen">
      <ThreeDots
        height="40" 
        width="80"
        radius="9"
        color="#fff"
        ariaLabel="three-dots-loading"
        visible={true} 
      />
    </div>
  );
}