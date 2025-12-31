import { describe, expect, it } from 'vitest';
import catchAsync, { AsyncHandler } from './catchAsync';
import { TServeResponse } from '@/utils/server/serveResponse';

describe('catchAsync Middleware', () => {
  it('should handle async responses correctly', async () => {
    const reqObj = {} as any;
    const fakeResponseData: TServeResponse<any> = {
      success: true,
      statusCode: 200,
      message: 'Testing success response',
      meta: {
        pagination: {
          page: 1,
          limit: 10,
          totalPages: 5,
          total: 50,
        },
      },
      data: {
        user: {
          id: 'test-id',
        },
      },
    };

    let capturedStatusCode: number = 0; //? placeholder for status code
    let capturedData: any;

    const resObj = {
      status: (code: number) => {
        capturedStatusCode = code;
        return {
          json: (data: typeof fakeResponseData) => {
            capturedData = data;
          },
        };
      },
    } as any;

    const nextFn = (err?: unknown) => {
      if (err instanceof Error) {
        throw err; // Fail the test if next is called with an error
      }
    };

    const controllerFn: AsyncHandler = async () => {
      return fakeResponseData;
    };

    const controller = catchAsync(controllerFn);

    await controller(reqObj, resObj, nextFn);

    expect(capturedStatusCode).toBe(fakeResponseData.statusCode);
    expect(capturedData).toEqual(fakeResponseData);
  });

  it('should catch errors from async functions', async () => {
    const reqObj = {} as any;
    const resObj = {} as any;
    const errorMessage = 'Async error occurred';

    let capturedError: unknown;

    //? Mock next function to capture the error
    const nextFn = (err?: unknown) => {
      capturedError = err;
    };

    const controllerFn: AsyncHandler = async () => {
      //? Simulate an async error
      throw new Error(errorMessage);
    };

    const controller = catchAsync(controllerFn);

    await controller(reqObj, resObj, nextFn);

    if (capturedError instanceof Error) {
      expect(capturedError.message).toBe(errorMessage);
    } else {
      throw new Error('Expected an error to be passed to next()');
    }
  });

  it('should handle controllers that return void', async () => {
    const reqObj = {} as any;

    let statusCalled = false;
    const resObj = {
      status: () => {
        statusCalled = true;
        return { json: () => resObj };
      },
    } as any;

    let nextCalled = false;
    const nextFn = () => {
      nextCalled = true;
    };

    const controllerFn: AsyncHandler = async () => {
      return void 0;
    };

    const controller = catchAsync(controllerFn);

    await controller(reqObj, resObj, nextFn);

    expect(statusCalled).toBe(false);
    expect(nextCalled).toBe(false);
  });
});
