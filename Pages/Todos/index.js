import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Swipeable } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Todo() {
  const [todo, setTodo] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const colors = [
    ["#ffecd2", "#fcb69f"],
    ["#e0c3fc", "#8ec5fc"],
    ["#d4fc79", "#96e6a1"],
    ["#08B4DF", "#56CCF2"],
    ["#fbc2eb", "#a6c1ee"],
  ];

  const loadTodos = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem("@todos");
      if (savedTodos) setTodo(JSON.parse(savedTodos));
    } catch (e) {
      console.log("Error loading todos:", e);
    }
  };
  useEffect(() => {
    loadTodos();
  }, []);

  const saveTodos = async (todos) => {
    try {
      await AsyncStorage.setItem("@todos", JSON.stringify(todos));
    } catch (e) {
      console.log("Error saving todos:", e);
    }
  };

  const showAlert = (msg) => {
    setAlertMsg(msg);
    setAlertVisible(true);
  };

  const handleAdd = () => {
    if (!name) return showAlert("⚠️ Please Enter a Name");
    if (!age) return showAlert("⚠️ Please Enter an Age");

    const newTodo = { id: Date.now().toString(), name, age, completed: false };
    const updatedTodos = [newTodo, ...todo];
    setTodo(updatedTodos);
    saveTodos(updatedTodos);
    setName("");
    setAge("");
    showAlert("✅ Todo Added Successfully!");
  };

  const handleRemove = (id) => {
    const updatedTodos = todo.filter((item) => item.id !== id);
    setTodo(updatedTodos);
    saveTodos(updatedTodos);
    showAlert("🗑️ Todo Deleted!");
  };

  const toggleComplete = (id) => {
    const updatedTodos = todo.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setTodo(updatedTodos);
    saveTodos(updatedTodos);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>✨ Todo App ✨</Text>

      <Animatable.View
        animation="fadeInDown"
        duration={800}
        style={styles.inputSection}
      >
        <TextInput
          style={styles.input}
          placeholder="Enter your Name"
          placeholderTextColor="#aaa"
          onChangeText={setName}
          value={name}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your Age"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          onChangeText={setAge}
          value={age}
        />
        <Animatable.View animation="pulse" iterationCount="infinite">
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>+ Add Todo</Text>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        style={styles.todoList}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        {todo.length === 0 ? (
          <Animatable.Text
            animation="fadeIn"
            style={{
              textAlign: "center",
              marginTop: 50,
              fontSize: 18,
              color: "#777",
            }}
          >
            🌸 No Todos Yet. Add Something Cool!
          </Animatable.Text>
        ) : (
          todo.map((item, index) => {
            const gradient = colors[index % colors.length];
            return (
              <Swipeable
                key={item.id}
                renderRightActions={() => (
                  <TouchableOpacity
                    style={styles.swipeDelete}
                    onPress={() => handleRemove(item.id)}
                  >
                    <Text style={styles.deleteBtnText}>🗑️</Text>
                  </TouchableOpacity>
                )}
              >
                <Animatable.View
                  animation="fadeInUp"
                  duration={600}
                  delay={index * 150}
                  style={[styles.todoCard, { backgroundColor: gradient[1] }]}
                >
                  <TouchableOpacity
                    style={styles.todoText}
                    onPress={() => toggleComplete(item.id)}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <Text
                        style={[
                          styles.todoIndex,
                          item.completed && styles.completedText,
                        ]}
                      >
                        {index + 1}.
                      </Text>
                      <Text
                        style={[
                          styles.todoName,
                          item.completed && styles.completedText,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.todoAge,
                        item.completed && styles.completedAge,
                      ]}
                    >
                      {item.age} yrs
                    </Text>
                  </TouchableOpacity>
                </Animatable.View>
              </Swipeable>
            );
          })
        )}
      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View
            animation="zoomIn"
            duration={400}
            style={styles.modalBox}
          >
            <Text style={styles.modalText}>{alertMsg}</Text>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => setAlertVisible(false)}
            >
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f7fb",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#222",
  },
  inputSection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  input: {
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
    backgroundColor: "#fafafa",
  },
  addBtn: {
    backgroundColor: "#08B4DF",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  todoList: { marginTop: 10 },
  todoCard: {
    borderRadius: 18,
    padding: 16,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  todoText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-between",
    width: "100%",
  },
  todoIndex: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  todoName: { fontSize: 16, fontWeight: "600", color: "#fff" },
  todoAge: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#34A853",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: "hidden",
  },
  swipeDelete: {
    backgroundColor: "#ce0e00ff",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
    overflow: "hidden",
    height: 55,
    marginTop: 8,
    marginLeft: 10,
  },
  deleteBtnText: {
    color: "#fff",
    fontSize: 20,
    lineHeight: 16,
    textAlign: "center",
  },
  completedText: { textDecorationLine: "line-through", opacity: 0.6 },
  completedAge: { backgroundColor: "#a5d6a7" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "75%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  modalBtn: {
    backgroundColor: "#08B4DF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  modalBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
``;
