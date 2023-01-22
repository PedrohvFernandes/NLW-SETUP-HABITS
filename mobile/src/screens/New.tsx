import { useState } from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native'
import { BackButton } from '../components/BackButton'
import { Checkbox } from '../components/Checkbox'
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'
import { api } from '../lib/axios'

const avaibleWeekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
]

export function New() {
  const [title, setTitle] = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([])

  function handleToggleWeekDay(weekDayIndex: number) {
    if (weekDays.includes(weekDayIndex)) {
      setWeekDays(weekDays.filter(weekDay => weekDay !== weekDayIndex))
    } else {
      // setWeekDays([...weekDays, weekDayIndex])
      setWeekDays(oldWeekDays => [...oldWeekDays, weekDayIndex])
    }
  }

  async function handleCreateNewHabit() {
    try {
      if (!title.trim() && weekDays.length === 0)
        return Alert.alert(
          'Novo hábito',
          'Informe os dados necessários  para criar o novo hábito'
        )
      if (weekDays.length === 0)
        return Alert.alert('Novo hábito', 'Informe os dias para o hábito')
      if (!title.trim())
        return Alert.alert('Novo hábito', 'Informe o título do hábito')

      const data = {
        title,
        weekDays
      }

      await api.post('/habits', data)
      setTitle('')
      setWeekDays([])

      Alert.alert('Novo hábito', 'Hábito criado com sucesso')
    } catch (error) {
      console.log(error)
      Alert.alert('Ops 😳 ', 'Não foi possível criar o novo hábito')
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />
        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar novo hábito
        </Text>

        <Text className="mt-6 text-white font-semibold text-base">
          Qual seu comprometimento?
        </Text>

        <TextInput
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          placeholder="Ex: Ler 30 minutos por dia"
          placeholderTextColor={colors.zinc[400]}
          onChangeText={setTitle}
          value={title}
        />

        <Text className="font-semibold mt-4 mb-3 text-white text-base">
          Qual a recorrência?
        </Text>
        {avaibleWeekDays.map((weekDay, index) => (
          <Checkbox
            key={index}
            title={weekDay}
            checked={weekDays.includes(index)}
            onPress={() => handleToggleWeekDay(index)}
          />
        ))}

        <TouchableOpacity
          className="w-full h-14 flex flex-row justify-center items-center bg-green-600 rounded-md mt-6"
          activeOpacity={0.7}
          onPress={handleCreateNewHabit}
        >
          <Feather name="check" size={20} color={colors.white} />
          <Text className="font-semibold text-base text-white ml-2">
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
