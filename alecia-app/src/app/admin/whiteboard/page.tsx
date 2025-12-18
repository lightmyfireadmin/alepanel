import { WhiteboardEditor } from "@/components/admin/whiteboard/WhiteboardEditor";
import Breadcrumb from "@/components/admin/ui/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Whiteboard | Alecia Admin",
};

export default function WhiteboardPage() {
  return (
    <>
      <Breadcrumb pageName="Whiteboard" />
      <WhiteboardEditor />
    </>
  );
}
