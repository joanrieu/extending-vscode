import fetch from 'node-fetch';

export interface Character {
    name: string
    url: string
    height: string
    mass: string
    birth_year: string
}

export async function fetchCharacters(): Promise<Character[]> {
    const res = await fetch("https://swapi.co/api/people")
    const json = await res.json()
    return json.results
}

export async function fetchCharacter(uri: string): Promise<Character> {
    const res = await fetch(uri)
    const json = await res.json()
    return json
}

export async function searchCharactersByName(name: string): Promise<Character[]> {
    const res = await fetch("https://swapi.co/api/people?search=" + encodeURIComponent(name))
    const json = await res.json()
    return json.results
}
