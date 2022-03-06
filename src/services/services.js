import Dao from "../model/Dao.js";
import UserService from "./usersService.js";
import ProductsService from "./productsService.js"
import config from "../config/config.js"
import ChatService from "./chatsService.js";
import CartService from "./cartsService.js";

const dao = new Dao(config.mongo)

export const userService = new UserService(dao)
export const productsService = new ProductsService(dao)
export const chatsService = new ChatService(dao)
export const cartsService = new CartService(dao)



