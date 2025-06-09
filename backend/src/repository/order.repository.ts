import { Schema } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDto } from 'src/order/dto/order.dto';
import { v4 as uuid } from 'uuid';

export const OrderSchema = new Schema({
  id: { type: String, required: true, unique: true },
  film: { type: String, required: true },
  session: { type: String, required: true },
  daytime: { type: Date, required: true },
  row: { type: Number, required: true },
  seat: { type: Number, required: true },
  price: { type: Number, required: true },
});

@Injectable()
export class OrderRepository {
  constructor(@InjectModel('Order') private orderModel: Model<OrderDto>) {}

  async create(order: OrderDto): Promise<OrderDto> {
    const newOrder = new this.orderModel({
      ...order,
      id: uuid(),
    });
    await newOrder.save();
    return newOrder.toObject();
  }

  async findById(id: string): Promise<OrderDto | null> {
    const order = await this.orderModel.findOne({ id }).exec();
    return order ? order.toObject() : null;
  }

  async findByFilmAndSession(
    film: string,
    session: string,
  ): Promise<OrderDto[]> {
    const orders = await this.orderModel.find({ film, session }).exec();
    return orders.map((order) => order.toObject());
  }

  async update(id: string, order: OrderDto): Promise<OrderDto | null> {
    const updatedOrder = await this.orderModel
      .findOneAndUpdate({ id }, order, { new: true })
      .exec();
    return updatedOrder ? updatedOrder.toObject() : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.orderModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }

  async getAll(): Promise<OrderDto[]> {
    const orders = await this.orderModel.find().exec();
    return orders.map((order) => order.toObject());
  }

  async getOrderIds(): Promise<string[]> {
    const orders = await this.orderModel.find().exec();
    return orders.map((order) => order.id);
  }
}
