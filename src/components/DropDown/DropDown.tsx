import { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Session } from '@supabase/auth-helpers-nextjs';
import Modal from '../Modal';
import DeleteActiveIcon from '@/svgIcons/DeleteActiveIcon';
import DeleteInactiveIcon from '@/svgIcons/DeleteInactiveIcon';
import EditActiveIcon from '@/svgIcons/EditActiveIcon';
import EditInactiveIcon from '@/svgIcons/EditInactiveIcon';

interface Props {
  author_id: string | null;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
  session?: Session | null;
}

const DropDown = ({ author_id, setEditing, handleDelete, session }: Props) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const confirmDelete = () => {
    setDeleteModalOpen(false);
    handleDelete();
  };

  return (
    <>
      <Modal
        title='Confirm Delete'
        message='Are you sure you want to delete this comment?'
        confirmText='Heck yeah, trash it!'
        rejectText='Nevermind, keep it.'
        open={deleteModalOpen}
        onConfirm={confirmDelete}
        onReject={() => setDeleteModalOpen(false)}
      />
      <Menu as='div' className='relative inline-block text-left'>
        <div>
          <Menu.Button className='inline-flex w-full justify-center rounded-md bg-indigo-700 bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
            <svg
              className='w-5 h-5 dark:text-gray-100'
              aria-hidden='true'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z'></path>
            </svg>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='ml-2 -mr-1 h-5 w-5 text-indigo-200 hover:text-indigo-100'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19.5 8.25l-7.5 7.5-7.5-7.5'
              />
            </svg>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            {session?.user.id === author_id ? (
              <>
                <div className='px-1 py-1 '>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-indigo-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => setEditing(true)}
                      >
                        {active ? (
                          <EditActiveIcon
                            className='mr-2 h-5 w-5'
                            aria-hidden='true'
                          />
                        ) : (
                          <EditInactiveIcon
                            className='mr-2 h-5 w-5'
                            aria-hidden='true'
                          />
                        )}
                        Edit
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className='px-1 py-1'>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setDeleteModalOpen(true)}
                        className={`${
                          active ? 'bg-indigo-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {active ? (
                          <DeleteActiveIcon
                            className='mr-2 h-5 w-5 text-indigo-400'
                            aria-hidden='true'
                          />
                        ) : (
                          <DeleteInactiveIcon
                            className='mr-2 h-5 w-5 text-indigo-400'
                            aria-hidden='true'
                          />
                        )}
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </>
            ) : (
              <></>
            )}
            {/* <div className='px-1 py-1'>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-indigo-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <ArchiveActiveIcon
                        className='mr-2 h-5 w-5'
                        aria-hidden='true'
                      />
                    ) : (
                      <ArchiveInactiveIcon
                        className='mr-2 h-5 w-5'
                        aria-hidden='true'
                      />
                    )}
                    Report
                  </button>
                )}
              </Menu.Item>
            </div> */}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default DropDown;
