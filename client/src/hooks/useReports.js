import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  deleteReport,
  fetchReport,
  fetchReports,
  fetchReportSummary
} from "../services/analysisService.js";

export const useReports = () =>
  useQuery({
    queryKey: ["reports"],
    queryFn: fetchReports
  });

export const useReport = (id) =>
  useQuery({
    queryKey: ["reports", id],
    queryFn: () => fetchReport(id),
    enabled: Boolean(id)
  });

export const useReportSummary = () =>
  useQuery({
    queryKey: ["reports", "summary"],
    queryFn: fetchReportSummary
  });

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
};

