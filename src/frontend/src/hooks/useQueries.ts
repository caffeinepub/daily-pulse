import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Article } from "../backend.d";
import { useActor } from "./useActor";

export function useListArticles(
  category: string | null,
  searchText: string | null,
) {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["articles", category, searchText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listArticles(category, searchText);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArticle(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Article | null>({
    queryKey: ["article", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getArticle(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateArticle() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      summary: string;
      body: string;
      category: string;
      author: string;
      imageUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createArticle(
        data.title,
        data.summary,
        data.body,
        data.category,
        data.author,
        data.imageUrl,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["articles"] }),
  });
}

export function useUpdateArticle() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      summary: string;
      body: string;
      category: string;
      author: string;
      imageUrl: string;
      isPublished: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateArticle(
        data.id,
        data.title,
        data.summary,
        data.body,
        data.category,
        data.author,
        data.imageUrl,
        data.isPublished,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      qc.invalidateQueries({ queryKey: ["article"] });
    },
  });
}

export function useDeleteArticle() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteArticle(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["articles"] }),
  });
}
