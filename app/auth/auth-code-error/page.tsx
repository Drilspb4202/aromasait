import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Ошибка аутентификации
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Произошла ошибка при попытке входа. Пожалуйста, попробуйте снова.
          </p>
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
}
