'use client';

import { trpc } from '@/utils/trpc';

export default function ListUsers() {
  const { data } = trpc.user.getUsers.useQuery({ limit: 10, page: 1 });

  return (
    <>
      {data?.data.selected_users.length === 0 ? (
        <p className='text-center'>No Users Found</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 20,
          }}
        >
          {data?.data.selected_users?.map((user) => (
            <div
              key={user.id}
              className='flex flex-col justify-center items-center border-gray-200 border'
            >
              <h3>{user.email}</h3>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
