import { Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export function HabitsEmpty() {
  const { navigate } = useNavigation()

  return (
    <>
      <Text className='text-zinc-400 text-base'>Ops 😳 {' '}</Text>
      <Text className='text-zinc-400 text-base'>parece que você ainda não tem hábitos cadastrados.{' '}</Text>
      
      <Text 
        className='text-violet-400 text-base underline active:text-violet-500 transition-all duration-300'
        onPress={() => navigate('New')}
      >
        comece cadastrando um. 😃
      </Text>
    </>
  )
}
