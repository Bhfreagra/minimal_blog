import { Request, Response } from "express";
import { BaseController } from "../../common/controllers/base.controller";
import { Pagination } from "../../common/utilities/pagination";
import { IPaginationDTO } from "../../common/utilities/pagination.interface";
import { PostManager } from "../services/post.manager.service";
import { PostAlreadyExistsError, PostNotFoundError } from "../utilities/post.errors";
import { IPostDTO } from "../utilities/post.interface";


export class PostController extends BaseController{

  private readonly postManager: PostManager;

  constructor(postManager: PostManager) {
    super();
    this.postManager = postManager;
  }

  public listPosts = async (request: Request, response: Response) => {

    try {

      const pagination: Pagination = new Pagination(response.locals.pagination);
      const paginationDTO: IPaginationDTO = {
        size: pagination.getSize(),
        offset: pagination.getOffset(),
        orderBy: pagination.getOrderBy(),
        orderDirection: pagination.getOrderDirection()
      };

      const [posts, total] = await this.postManager.getPostList(paginationDTO);
      response.status(200).send({posts, total});
      
    } catch(err) {
      response.status(this.internalServerError.code).send(this.internalServerError.getErrorResponse());
    }
  }

  public addPost = async (request: Request, response: Response) => {

    try {

      const postDto: IPostDTO = {...request.body};

      const post = await this.postManager.addPost(postDto);
      response.status(201).send(post);

    } catch(err) {

      if (err instanceof PostAlreadyExistsError) {
        return response.status(err.code).send(err.getErrorResponse());
      }

      response.status(this.internalServerError.code).send(this.internalServerError.getErrorResponse());
    }
  }

  public getPost = async (request: Request, response: Response) => {

    try {
      
      const post = await this.postManager.getPostById(+request.params.postId);
      response.status(200).send(post);

    } catch(err) {

      if (err instanceof PostNotFoundError) {
        return response.status(err.code).send(err.getErrorResponse());
      }

      response.status(this.internalServerError.code).send(this.internalServerError.getErrorResponse());
    }
  }

  public modifyPost = async (request: Request, response: Response) => {

    try {
      
      const postDto: IPostDTO = {
        id: +request.params.postId,
        ...request.body
      };

      const post = await this.postManager.updatePost(postDto);
      response.status(200).send(post);

    } catch(err) {

      if (err instanceof PostNotFoundError) {
        return response.status(err.code).send(err.getErrorResponse());
      }

      response.status(this.internalServerError.code).send(this.internalServerError.getErrorResponse());
    }
  }

  public deletePost = async (request: Request, response: Response) => {

    try {

      await this.postManager.deletePostById(+request.params.postId);
      response.status(204).send();

    } catch(err) {

      if (err instanceof PostNotFoundError) {
        return response.status(err.code).send(err.getErrorResponse());
      }
      
      response.status(this.internalServerError.code).send(this.internalServerError.getErrorResponse());
    }
  }
}