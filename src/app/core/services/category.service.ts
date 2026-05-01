import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private storageKey = 'categories';

  private subject = new BehaviorSubject<Category[]>(this.load());

  categories$ = this.subject.asObservable();

  private load(): Category[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [
      { id: '1', nome: 'Alimentação' },
      { id: '2', nome: 'Transporte' },
      { id: '3', nome: 'Moradia' }
    ];
  }

  private update(list: Category[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(list));
    this.subject.next(list);
  }

  getAll(): Category[] {
    return this.subject.value;
  }

  add(nome: string) {
    const nova: Category = {
      id: Date.now().toString(),
      nome
    };

    this.update([...this.subject.value, nova]);
  }
}