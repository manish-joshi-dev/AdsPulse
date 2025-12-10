import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { uploadCsv } from "../services/analysisService.js";

export const useUploadAnalysis = ({ onComplete } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadCsv,
    onMutate: () => {
      toast.loading("Analyzing CSV", { id: "upload" });
    },
    onSuccess: (report) => {
      toast.success("Diagnostic report ready", { id: "upload" });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports", "summary"] });
      onComplete?.(report);
    },
    onError: (error) => {
      toast.error(error.message, { id: "upload" });
    }
  });
};

