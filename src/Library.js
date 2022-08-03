import styles from './Library.module.css';
import {LoadingIcon, UpButton, DownButton} from './Icons';
import {useEffect, useState} from "react";

// * You are provided with an incomplete <Library /> component.
// * You are not allowed to add any additional HTML elements.
// * You are not allowed to use refs.

// * Once the <Library /> component is mounted, wait 2 seconds and then fetch the book JSON data
//   from http://localhost:3000/books.json using `fetch`.
// * Once the data is successfully fetched, hide the loading icon.
// * Take the "books" array from the fetched data and render each object in it as a <Book/> component.
// * Pass in the necessary props to each <Book/> component.
// * Typing into the search field should filter books by title and author.
// * That means a book is only shown if either its "title" and/or "author" field contains the search query.
// * The search should be case insensitive.
//   For example, "Da Vinci Code" is shown if you search for "da vinci", "Da Vinci" or "DA VincI", etc.
// * If the search field is empty, show all books.
// * Clicking the up arrow should change the book order to show the oldest books first.
// * Clicking the down arrow should change the book order to show the newest books first.
const BOOK_URL = 'http://localhost:3000/books.json';

const Book = ({title, author, publicationYear}) => {
    return (
        <div className={styles.book}>
            <h2 className={styles.bookTitle}>{title}</h2>
            <p className={styles.bookDescription}>Published by <strong>{author}</strong> in <em>{publicationYear}</em>
            </p>
        </div>
    );
}

const Library = () => {

    const [allBooks, setAllBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mount, setMount] = useState(true);


    useEffect(() => {
        if (mount) {

            setTimeout(()=>{
                fetch(BOOK_URL).then((response)=> response.json()).then((books)=>{
                    setAllBooks(books.books);
                    setLoading(false);
                });
            },2000);
        }

        return () => {
            setMount(false);
        }
        
    });

    const callSearch = (e) => {
        let value = e.target.value;
        if (value.length>0) {
            searchAllBooks(value);
        } else if (value === "") {
            // * If the search field is empty, show all books.
            fetch(BOOK_URL).then((response)=> response.json()).then((books)=>{
                setAllBooks(books.books);
                setLoading(false);
            });        
        }
    }

    const searchAllBooks = (query) => {
        let data = [];
        setLoading(true);
        if(allBooks.length){
            allBooks.forEach(value => {
                if (value.title.toLowerCase().search(query.toLowerCase()) >= 0 || value.author.toLowerCase().search(query.toLowerCase()) >= 0) {
                    data.push(value);
                }
            });
        }
        setLoading(false);
        setAllBooks(data);
    }

    // * Clicking the down arrow should change the book order to show the newest books first.
    const descendingYear = () =>{
        // console.log('sorting');
        setLoading(true);

        let newData = [];
        setTimeout(() => {

            newData = allBooks.sort((a,b) => {
                if (a.publicationYear > b.publicationYear) {
                    return 1;
                } else {
                    return -1;
                }
            });

            setAllBooks(newData);

            setLoading(false);

        },1000);
    

    }
    
    // * Clicking the up arrow should change the book order to show the oldest books first.
    const ascendingYear = () =>{
        // console.log('sorting');
        setLoading(true);
        let newData = [];
        
        setTimeout(() => {

            newData = allBooks.sort((a,b) => {
                if (a.publicationYear < b.publicationYear) {
                    return 1;
                } else {
                    return -1;
                }
            });

            setAllBooks(newData);
            setLoading(false);
        },1000);
    
    }

    return (
        <div>
            <header className={styles.header}>
                <div className={styles.sort}>
                    <span className={styles.sortLabel}>Sort by publication year</span>
                    <span>
            <UpButton 
                      className={styles.arrow}
                      onClick={ascendingYear}
            />
            <DownButton 
                        className={styles.arrow}
                        onClick={descendingYear}
            />
          </span>
                </div>

                <input
                    type="search"
                    id="search"
                    placeholder="Search books..."
                    className={styles.search}
                    onChange={callSearch}
                    
                />
            </header>
            <main>
                <h1>React library</h1>
                {loading && (
                <LoadingIcon/>
                )}
                {/* Books should be rendered here */}
                {allBooks.map((book, index) => {
                    // * Pass in the necessary props to each <Book/> component.
                    return (
                    <Book title={book.title} author={book.author} publicationYear={book.publicationYear} key={index}/>
                    );
                })}

                
            </main>
        </div>
    );
};

export default Library;