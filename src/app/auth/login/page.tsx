'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../../firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async data => {
    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then(()=> {
        router.push('/');
      })
      .catch(error => {
        if (error.code === 'auth/invalid-login-credentials') {
          alert('そのメールアドレスは登録されていません。');
        } else {
          alert(error.message);
        }
      });
  };

  return (
    <div className=" h-screen flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h1 className="mb-4 text-2xl text-gray-700 font-medium">ログイン</h1>
        <div className="mb-4 ">
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            {...register('email', {
              required: 'メールアドレスは必須です',
              pattern: {
                value:
                  /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                message: 'メールアドレスを入力してください。',
              },
            })}
            type="text"
            className=" mt-1 border-2 rounded-md w-full p-2"
          />
          {errors.email && (
            <span className="text-red-600 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div className="mb-4 ">
          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            {...register('password', {
              required: 'パスワードは必須です',
              minLength: {
                value: 6,
                message: '６文字以上のパスワードを設定してください。',
              },
            })}
            type="password"
            className=" mt-1 border-2 rounded-md w-full p-2"
          />
          {errors.password && (
            <span className="text-red-600 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className=" bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            ログイン
          </button>
        </div>
        <div className="mt-4 flex flex-col items-start">
          <span className="text-gray-600 text-sm">
            初めてご利用の方はこちら
          </span>
          <Link href='/auth/register' className=" text-blue-500 text-sm font-bold hover:text-blue-700">
            新規登録へ
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
