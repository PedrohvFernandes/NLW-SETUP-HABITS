import LogoImage from '../assets/logo.svg'
import { Plus, X } from 'phosphor-react'
import * as Dialog from '@radix-ui/react-dialog'
import { NewHabitForm } from './NewHabitForm'

export function Header() {
  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
      <img src={LogoImage} alt="Habits" />
      <Dialog.Root>
        <Dialog.Trigger 
          type="button"
          className="border border-violet-500 font-semibold rounded-lg px-6 py-4 flex items-center gap-3 hover:text-black hover:border-violet-300 hover:bg-violet-500 transition-colors duration-300 group focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-bg"
        >
          <Plus size={20} className="text-violet-500 group-hover:text-black" />
          Novo hábito
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className='w-screen h-screen bg-black/80 fixed inset-0'/>
          <Dialog.Content className="absolute p-10 bg-zinc-900 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Dialog.Close className="absolute top-4 right-4 text-zinc-400 font-bold cursor-pointer hover:text-zinc-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-bg hover:outline-none hover:ring-2 hover:ring-violet-700 hover:ring-offset-2 hover:ring-offset-zinc-900 rounded-lg">
              {/* &times; */}
              <X size={24} aria-label='Fechar' />
            </Dialog.Close>

            <Dialog.Title className='text-3xl leading-tight font-extrabold'>
              Criar novo hábito
            </Dialog.Title>

            <NewHabitForm/>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
