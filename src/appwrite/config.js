import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage ,Query} from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;
    constructor(){
         this.client 
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectID);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title,slug, content, featuredImage, status, userId}){
        try{
           return await this.databases.createDocument(
               conf.appwriteDatabaseID,
               conf.collectionID,
               slug,
               {
                   title,
                   content,
                   featuredImage,
                   status,
                   userId,
                   slug
               }
           );
        }
        catch (error) {
            console.error("Error creating post:", error);
        }

    }

    async updatePost(slug,{ title, content, featuredImage, status}) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.collectionID,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            );
        }
        catch (error) {
            console.error("Error updating post:", error);
        }
    }

    async deletePost(slug) {
        try{
            await this.databases.deleteDocument(
                conf.appwriteDatabaseID,
                conf.collectionID,
                slug
            )
            return true
        }
        catch (error) {
            console.error("Error deleting post:", error);
            return false
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseID,
                conf.collectionID,
                slug
            );
        }
        catch (error) {
            console.error("Error fetching post:", error);
        }
    }

    async getPosts( queries = [Query.equal("status", "active")] ) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseID,
                conf.collectionID,
                queries,
            );
        }
        catch (error) {
            console.error("Error fetching all posts:", error);
        }
    }

    // file upload services --> IN FUTURE KEEP IT IN SEPERATE FILE
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteURL,
                ID.unique(),
                file
            );
            
        }
        catch (error) {
            console.error("Error uploading file:", error);
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteURL,
                fileId
            );
            return true;
        }
        catch (error) {
            console.error("Error deleting file:", error);
            return false;
        }
    }

     getFilePreview(fileId) {
        try {
            return this.bucket.getFilePreview(
                conf.appwriteURL,
                fileId
            );
        }
        catch (error) {
            console.error("Error fetching file preview:", error);
        }
    }

}

const service = new Service();
export default service;