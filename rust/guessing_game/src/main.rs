use std::io;

fn main() {
    println!("Guess the number!");

    println!("Bitte geben Sie einen Kostenvoranschlag ab!");

    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read the line");

    println!("You guessed {guess}");
}
