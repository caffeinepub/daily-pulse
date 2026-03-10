import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Article {
    id: bigint;
    title: string;
    isPublished: boolean;
    body: string;
    publishedAt: bigint;
    author: string;
    summary: string;
    imageUrl: string;
    category: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createArticle(title: string, summary: string, body: string, category: string, author: string, imageUrl: string): Promise<bigint>;
    deleteArticle(id: bigint): Promise<void>;
    getArticle(id: bigint): Promise<Article | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listArticles(category: string | null, searchText: string | null): Promise<Array<Article>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateArticle(id: bigint, title: string, summary: string, body: string, category: string, author: string, imageUrl: string, isPublished: boolean): Promise<void>;
}
