import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { MdWarning } from 'react-icons/md';

const CancelConfirmationModal = ({ isOpen, onClose, onConfirm, quotation }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="text-center">
                  <div className="mb-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                      <MdWarning className="h-8 w-8 text-red-600" />
                    </div>
                  </div>

                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-gray-900 mb-4"
                  >
                    Cancel Quotation
                  </Dialog.Title>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">
                      Are you sure you want to cancel this quotation?
                    </p>
                    {quotation && (
                      <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">
                          Quotation Details:
                        </p>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Quotation No: {quotation.quotation_no}</p>
                          <p>Client: {quotation.client}</p>
                          <p>Location: {quotation.location}</p>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-red-500 mt-4">
                      This action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-6 flex justify-center space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={onClose}
                    >
                      No, Keep It
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={onConfirm}
                    >
                      Yes, Cancel Quotation
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CancelConfirmationModal;
