import { GestureHandlerRootView } from "react-native-gesture-handler";
import Todo from "./Pages/Todos";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Todo />
    </GestureHandlerRootView>
  );
}
