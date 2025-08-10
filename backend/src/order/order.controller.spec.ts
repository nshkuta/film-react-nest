import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';

const mockOrder: OrderDto = {
  id: '1',
  film: 'Test Film',
  session: 'Session 1',
  daytime: new Date(),
  row: 5,
  seat: 10,
  price: 500,
};

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn(() => Promise.resolve(mockOrder)),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create new order', async () => {
      const orderData: OrderDto = {
        id: 'new-order-id',
        film: 'New Film',
        session: 'New Session',
        daytime: new Date(),
        row: 3,
        seat: 7,
        price: 450,
      };

      const result = await controller.createOrder(orderData);

      expect(result).toEqual(mockOrder);
      expect(service.createOrder).toHaveBeenCalledWith(orderData);
    });

    it('should handle invalid order data', async () => {
      jest
        .spyOn(service, 'createOrder')
        .mockRejectedValue(new Error('Invalid order data'));

      try {
        await controller.createOrder({
          film: 'Invalid Film',
          session: 'Invalid Session',
          daytime: new Date(),
          row: 3,
          seat: 7,
          price: 450,
        } as OrderDto);
      } catch (error) {
        expect(error.message).toBe('Invalid order data');
      }
    });

    it('should handle missing required fields', async () => {
      jest
        .spyOn(service, 'createOrder')
        .mockRejectedValue(new Error('Missing required fields'));

      try {
        await controller.createOrder({
          film: 'Test Film',
          session: 'Test Session',
          daytime: new Date(),
          row: 5,
          seat: 10,
          price: 500,
        } as OrderDto);
      } catch (error) {
        expect(error.message).toBe('Missing required fields');
      }
    });
  });
});
