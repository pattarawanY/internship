import { Injectable } from '@nestjs/common';

@Injectable() //บอกNestว่าคลาสนี้injectเข้าcontrollerได้
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealth() {
    return {
      status: 'ok',
      service: 'internship-training-api',
    };
  }
}
