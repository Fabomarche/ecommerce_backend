import Dao from "../model/Dao.js";
import UserService from "./usersService.js";
import ProductsService from "./productsService.js"
import config from "../config/config.js"

const dao = new Dao(config.mongo)

export const userService = new UserService(dao)
export const productsService = new ProductsService(dao)



