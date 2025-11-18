import tensorflow as tf
import matplotlib.pyplot as plt
(Xtrain,Ytrain),(Xtest,Ytest) = tf.keras.datasets.mnist.load_data()
print(Xtrain.shape)
print(Xtest.shape)
print(Ytrain.shape)
print(Ytest.shape)

Xtrain = Xtrain.reshape(-1,28,28,1)
Xtest = Xtest.reshape(-1,28,28,1)
Xtrain = Xtrain / 255.0
Xtest = Xtest / 255.0

print("----- adding an greyscale channel -----")
print(Xtrain.shape)
print(Xtest.shape)
print(Ytrain.shape)
print(Ytest.shape)

Ytrain = tf.keras.utils.to_categorical(Ytrain,10)
Ytest = tf.keras.utils.to_categorical(Ytest,10)

model = tf.keras.models.Sequential([
    # 28x28  ---->  14x14
    tf.keras.layers.Conv2D(32,(3,3),activation='relu',padding='same',input_shape=(28,28,1)),
    tf.keras.layers.MaxPooling2D((2,2)),
    # 14x14  ---->  7x7
    tf.keras.layers.Conv2D(64,(3,3),activation='relu',padding='same'),
    tf.keras.layers.MaxPooling2D((2,2)),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(128,activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(64,activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(10,activation='softmax')
])

model.compile(optimizer='adam',loss='categorical_crossentropy',metrics=['accuracy'])
epochs = 20
history = model.fit(Xtrain,Ytrain,batch_size=64,epochs=epochs,validation_data=(Xtest,Ytest))
test_loss, test_acc = model.evaluate(Xtest,Ytest)
print(f'\nTest accuracy: {test_acc:.4f}')
print(f'Test loss: {test_loss:.4f}')
# --- 8. Visualize Training History ---
acc = history.history['accuracy']
val_acc = history.history['val_accuracy']
loss = history.history['loss']
val_loss = history.history['val_loss']
epochs_range = range(epochs)

plt.figure(figsize=(12, 6))
plt.subplot(1, 2, 1)
plt.plot(epochs_range, acc, label='Training Accuracy')
plt.plot(epochs_range, val_acc, label='Validation Accuracy')
plt.legend(loc='lower right')
plt.title('Training and Validation Accuracy')

plt.subplot(1, 2, 2)
plt.plot(epochs_range, loss, label='Training Loss')
plt.plot(epochs_range, val_loss, label='Validation Loss')
plt.legend(loc='upper right')
plt.title('Training and Validation Loss')
plt.suptitle('Model Training History')
plt.show()

model.save('models/model1.h5')