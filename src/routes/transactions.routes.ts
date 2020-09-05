import { Router } from "express";
import { getRepository } from "typeorm";
import multer from "multer";
import uploadConfig from "../config/upload";
import TransactionsRepository from "../repositories/TransactionsRepository";
import CreateTransactionService from "../services/CreateTransactionService";
import Transaction from "../models/Transaction";
import Category from "../models/Category";
import DeleteTransactionService from "../services/DeleteTransactionService";
import ImportTransactionsService from "../services/ImportTransactionsService";

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get("/", async (request, response) => {
  let transactionRepo = new TransactionsRepository();
  let balance = await transactionRepo.getBalance();

  let transactions = await getRepository(Transaction).find();
  return response.json({ transactions, balance });
});

transactionsRouter.post("/", async (request, response) => {
  let { title, value, type, category } = request.body;
  let createService = new CreateTransactionService();
  let transaction = await createService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete("/:id", async (request, response) => {
  let { id } = request.params;

  let deleteService = new DeleteTransactionService();

  await deleteService.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  "/import",
  upload.single("file"),
  async (request, response) => {
    let service = new ImportTransactionsService();
    let categoryRepo =  getRepository(Category)

    let transactions = await service.execute(request.file.filename);
    let categories = await  categoryRepo.find()

    return response.json({transactions,categories});
  }
);

export default transactionsRouter;
