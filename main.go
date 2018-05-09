package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
)

func handler(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("tfjs-demo/dist/index.html")
	if err != nil {
		log.Fatal(err)
	}

	err = tmpl.Execute(w, nil)
	if err != nil {
		log.Fatal(err)
	}

}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("$PORT must be set")
	}

	http.Handle("/contents/", http.StripPrefix("/contents/", http.FileServer(http.Dir("tfjs-demo/dist/contents"))))
	http.Handle("/model/", http.StripPrefix("/model/", http.FileServer(http.Dir("tfjs-demo/dist/model"))))
	http.HandleFunc("/", handler)
	http.ListenAndServe(":"+port, nil)
}
