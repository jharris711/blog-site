import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Props {
  title: string;
  message: string;
  open: boolean;
  confirmText: string;
  rejectText: string;
  onConfirm: () => void;
  onReject: () => void;
}
const Modal = ({
  title,
  message,
  open,
  confirmText,
  rejectText,
  onConfirm,
  onReject,
}: Props) => {
  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={onReject}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-600 p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900 dark:text-white'
                  >
                    {title}
                  </Dialog.Title>
                  <div className='mt-2'>
                    <p className='text-sm text-gray-200'>{message}</p>
                  </div>

                  <div className='mt-4'>
                    <button
                      type='button'
                      className='mr-2 inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      onClick={onConfirm}
                    >
                      {confirmText}
                    </button>
                    <button
                      type='button'
                      className='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      onClick={onReject}
                    >
                      {rejectText}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
