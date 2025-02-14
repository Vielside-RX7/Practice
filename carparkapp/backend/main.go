/*
package main

import (

	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

)

// ParkingSpot represents the structure of a parking spot

	type ParkingSpot struct {
		ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
		Occupied bool               `bson:"occupied" json:"occupied"`
		CarID    *string            `bson:"carId,omitempty" json:"carId,omitempty"`
	}

// ParkingHandler handles all parking-related operations

	type ParkingHandler struct {
		collection *mongo.Collection
	}

// Setup creates a new ParkingHandler with MongoDB connection

	func Setup() (*ParkingHandler, error) {
		client, err := mongo.Connect(context.Background(), options.Client().ApplyURI("mongodb://localhost:27017"))
		if err != nil {
			return nil, err
		}

		err = client.Ping(context.Background(), nil)
		if err != nil {
			return nil, err
		}

		collection := client.Database("parking").Collection("spots")

		// Initialize parking spots if they don't exist
		count, err := collection.CountDocuments(context.Background(), bson.M{})
		if err != nil {
			return nil, err
		}

		if count == 0 {
			for i := 0; i < 100; i++ {
				spots := ParkingSpot{
					ID:       primitive.NewObjectID(),
					Occupied: false,
					CarID:    nil,
				}
				if _, err := collection.InsertOne(context.Background(), spots); err != nil {
					return nil, err
				}
			}
			log.Println("Initialized 100 unoccupied parking spots.")
		}

		return &ParkingHandler{collection: collection}, nil
	}

// Helper function to create timeout context

	func createTimeout() (context.Context, context.CancelFunc) {
		return context.WithTimeout(context.Background(), 10*time.Second)
	}

// getAllSpots returns all parking spots from the database

	func (h *ParkingHandler) getAllSpots(c *gin.Context) {
		ctx, cancel := createTimeout()
		defer cancel()

		var spots []ParkingSpot
		cursor, err := h.collection.Find(ctx, bson.M{})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch parking spots"})
			return
		}
		defer cursor.Close(ctx)

		err = cursor.All(ctx, &spots)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load parking spots"})
			return
		}

		c.JSON(http.StatusOK, spots)
	}

// enterCar adds a new car to an available parking spot

	func (h *ParkingHandler) enterCar(c *gin.Context) {
		ctx, cancel := createTimeout()
		defer cancel()

		var request struct {
			CarID string `json:"carId"`
		}

		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
			return
		}

		update := bson.M{"$set": bson.M{"occupied": true, "carId": request.CarID}}
		result := h.collection.FindOneAndUpdate(ctx, bson.M{"occupied": false}, update)
		if result.Err() != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No empty spots available"})
			return
		}

		var spot ParkingSpot
		err := result.Decode(&spot)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update parking spot"})
			return
		}

		c.JSON(http.StatusOK, spot)
	}

// exitCar removes a car from a parking spot by car ID

	func (h *ParkingHandler) exitCar(c *gin.Context) {
		ctx, cancel := createTimeout()
		defer cancel()

		var request struct {
			CarID string `json:"carId"`
		}

		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
			return
		}

		update := bson.M{"$set": bson.M{"occupied": false, "carId": nil}}
		result := h.collection.FindOneAndUpdate(ctx, bson.M{"carId": request.CarID}, update)
		if result.Err() != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Car not found"})
			return
		}

		c.Status(http.StatusNoContent)
	}

	func (h *ParkingHandler) getEmptySpots(c *gin.Context) {
		ctx, cancel := createTimeout()
		defer cancel()

		count, err := h.collection.CountDocuments(ctx, bson.M{"occupied": false})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count empty spots"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"emptySpots": count})
	}

	func main() {
		handler, err := Setup()
		if err != nil {
			log.Fatal("Failed to connect to MongoDB:", err)
		}

		router := gin.Default()

		router.Use(cors.New(cors.Config{
			AllowOrigins: []string{"http://localhost:3000"}, // Ensure this matches your frontend URL
			AllowMethods: []string{"GET", "POST", "DELETE", "OPTIONS"},
		}))

		router.GET("/spots", handler.getAllSpots)
		router.POST("/enter", handler.enterCar)
		router.POST("/exit", handler.exitCar)
		router.GET("/empty-spots", handler.getEmptySpots) // New route for getting empty spots

		log.Println("Server starting on http://localhost:8080")
		router.Run(":8080")
	}
*/
package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// ParkingSpot represents the structure of a parking spot
type ParkingSpot struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Occupied bool               `bson:"occupied" json:"occupied"`
	CarID    *string            `bson:"carId,omitempty" json:"carId,omitempty"`
}

// ParkingHandler handles all parking-related operations
type ParkingHandler struct {
	collection *mongo.Collection
}

// Setup creates a new ParkingHandler with MongoDB connection
func Setup() (*ParkingHandler, error) {
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		return nil, err
	}

	err = client.Ping(context.Background(), nil)
	if err != nil {
		return nil, err
	}

	collection := client.Database("parking").Collection("spots")

	count, err := collection.CountDocuments(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}

	if count == 0 {
		for i := 0; i < 100; i++ {
			spots := ParkingSpot{
				ID:       primitive.NewObjectID(),
				Occupied: false,
				CarID:    nil,
			}
			if _, err := collection.InsertOne(context.Background(), spots); err != nil {
				return nil, err
			}
		}
		log.Println("Initialized 100 unoccupied parking spots.")
	}

	return &ParkingHandler{collection: collection}, nil
}

// Helper function to create timeout context
func createTimeout() (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), 10*time.Second)
}

// getAllSpots returns all parking spots from the database
func (h *ParkingHandler) getAllSpots(c *gin.Context) {
	ctx, cancel := createTimeout()
	defer cancel()

	var spots []ParkingSpot
	cursor, err := h.collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch parking spots"})
		return
	}
	defer cursor.Close(ctx)

	err = cursor.All(ctx, &spots)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load parking spots"})
		return
	}

	c.JSON(http.StatusOK, spots)
}

// enterCar adds a new car to an available parking spot
/*
func (h *ParkingHandler) enterCar(c *gin.Context) {
	ctx, cancel := createTimeout()
	defer cancel()

	var request struct {
		CarID string `json:"carId"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	update := bson.M{"$set": bson.M{"occupied": true, "carId": request.CarID}}
	result := h.collection.FindOneAndUpdate(ctx, bson.M{"occupied": false}, update)
	if result.Err() != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No empty spots available"})
		return
	}

	var spot ParkingSpot
	err := result.Decode(&spot)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update parking spot"})
		return
	}

	c.JSON(http.StatusOK, spot)
}
*/
// enterCar adds a new car to an available parking spot
func (h *ParkingHandler) enterCar(c *gin.Context) {
	ctx, cancel := createTimeout()
	defer cancel()

	var request struct {
		CarID string `json:"carId"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Check if the car ID is already parked
	existingCarCount, err := h.collection.CountDocuments(ctx, bson.M{"carId": request.CarID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check existing car ID"})
		return
	}
	if existingCarCount > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Car with this ID is already parked"})
		return
	}

	update := bson.M{"$set": bson.M{"occupied": true, "carId": request.CarID}}
	result := h.collection.FindOneAndUpdate(ctx, bson.M{"occupied": false}, update)
	if result.Err() != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No empty spots available"})
		return
	}

	var spot ParkingSpot
	err = result.Decode(&spot)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update parking spot"})
		return
	}

	c.JSON(http.StatusOK, spot)
}

// exitCar removes a car from a parking spot by car ID
func (h *ParkingHandler) exitCar(c *gin.Context) {
	ctx, cancel := createTimeout()
	defer cancel()

	var request struct {
		CarID string `json:"carId"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	update := bson.M{"$set": bson.M{"occupied": false, "carId": nil}}
	result := h.collection.FindOneAndUpdate(ctx, bson.M{"carId": request.CarID}, update)
	if result.Err() != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Car not found"})
		return
	}

	c.Status(http.StatusNoContent)
}

// getEmptySpots returns the number of empty parking spots
func (h *ParkingHandler) getEmptySpots(c *gin.Context) {
	ctx, cancel := createTimeout()
	defer cancel()

	count, err := h.collection.CountDocuments(ctx, bson.M{"occupied": false})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count empty spots"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"emptySpots": count})
}

func main() {
	handler, err := Setup()
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	router.GET("/spots", handler.getAllSpots)
	router.POST("/enter", handler.enterCar)
	router.POST("/exit", handler.exitCar)
	router.GET("/empty-spots", handler.getEmptySpots)

	log.Println("Server starting on http://localhost:8080")
	router.Run(":8080")
}
